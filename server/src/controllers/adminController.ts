import { Request, Response } from 'express';
import Student from '../models/Student.js';
import { sendPaymentLink } from '../services/emailService.js';
import PDFDocument from 'pdfkit-table';

// Create Student
export const createStudent = async (req: Request, res: Response) => {
    try {
        const organizationId = req.user?.organizationId;
        if (!organizationId) return res.status(403).json({ message: 'Organization ID missing' });

        const { studentName, email, mobileNumber, feeRecurringDate, amount } = req.body;

        // Check existing student? Email should be unique globally or per org? 
        // Schema says unique sparse.
        if (email) {
            const existing = await Student.findOne({ email });
            if (existing) return res.status(400).json({ message: 'Student with this email already exists' });
        }

        const student = new Student({
            studentName,
            email,
            mobileNumber,
            feeRecurringDate,
            amount,
            organizationId,
            isEnabled: true
        });

        await student.save();
        res.status(201).json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error creating student', error });
    }
};

// Get Students (Search, Filter, Pagination)
export const getStudents = async (req: Request, res: Response) => {
    try {
        const organizationId = req.user?.organizationId;
        if (!organizationId) return res.status(403).json({ message: 'Organization ID missing' });

        const page = parseInt(req.query.page as string) || 1;
        const limit = 5;
        const search = req.query.search as string || '';
        const sort = req.query.sort as string; // 'nearDate'
        const status = req.query.status as string; // 'true' | 'false'
        const minAmount = req.query.minAmount ? Number(req.query.minAmount) : undefined;
        const maxAmount = req.query.maxAmount ? Number(req.query.maxAmount) : undefined;

        const query: any = { organizationId };

        if (search) {
            query.$or = [
                { studentName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { mobileNumber: { $regex: search, $options: 'i' } }
            ];
        }

        if (status) {
            query.isEnabled = status === 'true';
        }

        if (minAmount !== undefined || maxAmount !== undefined) {
            query.amount = {};
            if (minAmount !== undefined) query.amount.$gte = minAmount;
            if (maxAmount !== undefined) query.amount.$lte = maxAmount;
        }

        // Sort Logic
        let sortOption: any = { createdAt: -1 };
        if (sort === 'nearDate') {
            // Nearest recurring date to today.
            // This is tricky in MongoDB simple sort if dates are past/future mixed.
            // Usually means "closest absolute difference".
            // Or just ascending order of feeRecurringDate?
            // Let's assume ascending order for simplicity as "upcoming".
            sortOption = { feeRecurringDate: 1 };
        }

        const total = await Student.countDocuments(query);
        const students = await Student.find(query)
            .sort(sortOption)
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            data: students,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                startIndex: (page - 1) * limit + 1,
                endIndex: Math.min(page * limit, total)
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching students', error });
    }
};

// Update Student
export const updateStudent = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { studentName, email, mobileNumber, feeRecurringDate, amount } = req.body;

        const student = await Student.findOneAndUpdate(
            { _id: id, organizationId: req.user?.organizationId },
            { studentName, email, mobileNumber, feeRecurringDate, amount },
            { new: true }
        );

        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error updating student', error });
    }
};

// Toggle Status
export const toggleStudentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { isEnabled } = req.body;

        const student = await Student.findOneAndUpdate(
            { _id: id, organizationId: req.user?.organizationId },
            { isEnabled },
            { new: true }
        );

        if (!student) return res.status(404).json({ message: 'Student not found' });
        res.json(student);
    } catch (error) {
        res.status(500).json({ message: 'Error updating status', error });
    }
};

// Send Payment Link
export const sendPaymentLinkEmail = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const student = await Student.findOne({ _id: id, organizationId: req.user?.organizationId });

        if (!student || !student.email) {
            return res.status(404).json({ message: 'Student not found or email missing' });
        }

        // Generate Razorpay Link or use a frontend URL with query params
        // Assuming frontend URL for now: e.g., https://myapp.com/pay?studentId=...
        const paymentLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pay/${student._id}`;

        await sendPaymentLink(student.email, student.studentName, paymentLink);
        res.json({ message: 'Payment link sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error });
    }
};

// Generate PDF Report
export const generatePDFReport = async (req: Request, res: Response) => {
    try {
        const organizationId = req.user?.organizationId;
        const students = await Student.find({ organizationId });

        const doc = new PDFDocument({ margin: 30, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=students_report.pdf');

        doc.pipe(res);

        doc.fontSize(18).text('Student Report', { align: 'center' });
        doc.moveDown();

        const table = {
            title: "All Students",
            subtitle: `Total Students: ${students.length}`,
            headers: ["Name", "Email", "Mobile", "Amount", "Due Date", "Status"],
            rows: students.map((s: any) => [
                s.studentName,
                s.email || '-',
                s.mobileNumber || '-',
                s.amount.toString(),
                new Date(s.feeRecurringDate).toLocaleDateString(),
                s.isEnabled ? 'Active' : 'Disabled'
            ]),
        };

        await doc.table(table as any, {
            width: 500,
        });

        doc.end();

    } catch (error) {
        res.status(500).json({ message: 'Error generating PDF', error });
    }
};
