import { Request, Response } from 'express';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import { sendPaymentLink, sendReminder } from '../services/emailService.js';
import PDFDocument from 'pdfkit-table';
import { uploadToS3, getSignedDownloadUrl } from '../services/S3service.js';

// Create Student
export const createStudent = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        if (!organizationId) return res.status(403).json({ message: 'Organization ID missing' });

        const { studentName, email, mobileNumber, feeRecurringDate, amount } = req.body;

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
        const organizationId = req.organizationId;
        if (!organizationId) return res.status(403).json({ message: 'Organization ID missing' });

        const page = parseInt(req.query.page as string) || 1;
        const limit = 5;
        const search = req.query.search as string || '';
        const sort = req.query.sort as string;
        const status = req.query.status as string;
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

        let sortOption: any = { createdAt: -1 };
        if (sort === 'nearDate') {
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
            { _id: id, organizationId: req.organizationId },
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
            { _id: id, organizationId: req.organizationId },
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
        const student = await Student.findOne({ _id: id, organizationId: req.organizationId });

        if (!student || !student.email) {
            return res.status(404).json({ message: 'Student not found or email missing' });
        }

        const paymentLink = `${process.env.CLIENT_URI}/pay/${student._id}`;
        await sendPaymentLink(student.email, student.studentName, paymentLink);
        res.json({ message: 'Payment link sent successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error sending email', error });
    }
};

// Generate PDF Report — now uploads to S3 instead of R2
export const generatePDFReport = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        const students = await Student.find({ organizationId });

        // Build PDF with pdfkit-table (works fine on Node.js/AWS)
        const doc = new PDFDocument({ margin: 30, size: 'A4' });
        const chunks: Buffer[] = [];

        doc.on('data', (chunk) => chunks.push(chunk));

        const pdfReady = new Promise<Buffer>((resolve, reject) => {
            doc.on('end', () => resolve(Buffer.concat(chunks)));
            doc.on('error', reject);
        });

        doc.fontSize(18).text('Student Report', { align: 'center' });
        doc.moveDown();

        const table = {
            title: "Student Fees Report",
            headers: ["Name", "Email", "Amount", "Status"],
            rows: students.map((s: any) => [
                s.studentName,
                s.email || '-',
                s.amount.toString(),
                s.isEnabled ? 'Active' : 'Disabled'
            ]),
        };

        await doc.table(table as any, { width: 500 });
        doc.end();

        const pdfBuffer = await pdfReady;

        // Upload to S3 (replaces R2 bucket.put)
        const s3Key = `reports/report_${organizationId}_${Date.now()}.pdf`;
        await uploadToS3(s3Key, pdfBuffer, 'application/pdf');

        // Return a pre-signed URL valid for 1 hour (replaces the /upload/:filename route)
        const downloadUrl = await getSignedDownloadUrl(s3Key, 3600);

        res.json({
            message: 'Report generated. Link expires in 1 hour.',
            downloadUrl
        });

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).json({ message: 'Error generating PDF', error });
    }
};

// Get Monthly Stats
export const getMonthlyStats = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        const currentMonthPayments = await Payment.aggregate([
            {
                $match: {
                    organizationId: organizationId,
                    createdAt: { $gte: startOfMonth },
                    status: 'completed'
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        const totalCollections = currentMonthPayments[0]?.total || 0;
        const transactionVolume = currentMonthPayments[0]?.count || 0;

        const lastMonthPayments = await Payment.aggregate([
            {
                $match: {
                    organizationId: organizationId,
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                    status: 'completed'
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const lastMonthCollections = lastMonthPayments[0]?.total || 0;

        let collectionGrowth = 0;
        if (lastMonthCollections > 0) {
            collectionGrowth = ((totalCollections - lastMonthCollections) / lastMonthCollections) * 100;
        } else if (totalCollections > 0) {
            collectionGrowth = 100;
        }

        const pendingPayments = await Payment.aggregate([
            {
                $match: {
                    organizationId: organizationId,
                    createdAt: { $gte: startOfMonth },
                    status: { $in: ['pending', 'failed'] }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const pendingDues = pendingPayments[0]?.total || 0;

        const lastMonthPending = await Payment.aggregate([
            {
                $match: {
                    organizationId: organizationId,
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth },
                    status: { $in: ['pending', 'failed'] }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const lastMonthPendingTotal = lastMonthPending[0]?.total || 0;

        let pendingGrowth = 0;
        if (lastMonthPendingTotal > 0) {
            pendingGrowth = ((pendingDues - lastMonthPendingTotal) / lastMonthPendingTotal) * 100;
        } else if (pendingDues > 0) {
            pendingGrowth = 100;
        }

        res.json({
            totalCollections,
            collectionGrowth: Math.round(collectionGrowth),
            pendingDues,
            pendingGrowth: Math.round(pendingGrowth),
            transactionVolume
        });

    } catch (error) {
        console.error("Error fetching stats:", error);
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

// Get Chart Data
export const getChartData = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        const end = new Date();
        const start = new Date();
        start.setMonth(start.getMonth() - 5);
        start.setDate(1);

        const payments = await Payment.aggregate([
            {
                $match: {
                    organizationId: organizationId,
                    createdAt: { $gte: start, $lte: end },
                    status: 'completed'
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: "$createdAt" },
                        year: { $year: "$createdAt" }
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } }
        ]);

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const result = payments.map((p: any) => ({
            name: monthNames[p._id.month - 1],
            value: p.total
        }));

        res.json(result);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching chart data', error });
    }
};

// Get Transactions
export const getTransactions = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 5;

        const total = await Payment.countDocuments({ organizationId });

        const transactions = await Payment.find({ organizationId })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .populate('studentId', 'studentName');

        const mappedTransactions = transactions.map((t: any) => ({
            _id: t._id,
            transactionId: t.razorpayPaymentId || t._id.toString().slice(-6).toUpperCase(),
            studentName: t.studentId?.studentName || 'Unknown',
            amount: t.amount,
            date: t.updatedAt,
            status: t.status
        }));

        res.json({
            data: mappedTransactions,
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
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};

// Send Payment Reminders (Bulk)
export const sendPaymentReminders = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        const now = new Date();
        const currentDay = now.getDate();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const students = await Student.find({ organizationId, isEnabled: true });

        const payments = await Payment.find({
            organizationId,
            status: 'completed',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }).select('studentId');

        const paidStudentIds = new Set(payments.map((p: any) => p.studentId.toString()));

        const overdueStudents = students.filter((student: any) => {
            const dueDay = new Date(student.feeRecurringDate).getDate();
            const isOverdue = currentDay > dueDay;
            const isPaid = paidStudentIds.has(student._id.toString());
            return isOverdue && !isPaid;
        });

        let sentCount = 0;
        for (const student of overdueStudents as any[]) {
            if (student.email) {
                await sendReminder(student.email, student.studentName, student.amount);
                sentCount++;
            }
        }

        res.json({ message: `Reminders sent to ${sentCount} students`, totalOverdue: overdueStudents.length });

    } catch (error) {
        console.error('Error sending reminders:', error);
        res.status(500).json({ message: 'Error sending reminders', error });
    }
};

// Get Pending Payments Count
export const getPendingPaymentsCount = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        const now = new Date();
        const currentDay = now.getDate();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        const students = await Student.find({ organizationId, isEnabled: true });

        const payments = await Payment.find({
            organizationId,
            status: 'completed',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        }).select('studentId');

        const paidStudentIds = new Set(payments.map((p: any) => p.studentId.toString()));

        const overdueStudents = students.filter((student: any) => {
            const dueDay = new Date(student.feeRecurringDate).getDate();
            const isOverdue = currentDay > dueDay;
            const isPaid = paidStudentIds.has(student._id.toString());
            return isOverdue && !isPaid;
        });

        res.json({
            count: overdueStudents.length,
            students: overdueStudents.map((s: any) => ({
                id: s._id,
                name: s.studentName,
                amount: s.amount,
                dueDate: new Date(s.feeRecurringDate).getDate()
            }))
        });

    } catch (error) {
        console.error('Error fetching pending count:', error);
        res.status(500).json({ message: 'Error fetching pending count', error });
    }
};