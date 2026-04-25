import { Request, Response } from 'express';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import PDFDocument from 'pdfkit-table';

export const getPaymentReceipt = async (req: Request, res: Response) => {
    try {
        const { paymentId } = req.params;

        const payment = await Payment.findById(paymentId);
        if (!payment) {
            return res.status(404).json({ message: 'Payment record not found' });
        }

        if (payment.status !== 'completed') {
            return res.status(400).json({ message: 'Receipt available only for successful payments' });
        }

        const student = await Student.findById(payment.studentId).populate('organizationId');
        if (!student) {
            return res.status(404).json({ message: 'Student details not found' });
        }

        // Calculate Next Due Date (30 days from payment date)
        const paymentDate = new Date(payment.createdAt);
        const nextDueDate = new Date(paymentDate);
        nextDueDate.setDate(nextDueDate.getDate() + 30);

        // Date Formatting
        // Date Formatting Helper
        const formatDate = (date: Date) => {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replace(/\//g, '-');
        };

        const dateStr = formatDate(paymentDate);
        // @ts-ignore
        const nextDueDateStr = formatDate(nextDueDate);
        // @ts-ignore
        const feeDate = new Date(student.feeRecurringDate).getDate();
        const currentMonthDueDate = new Date(paymentDate.getFullYear(), paymentDate.getMonth(), feeDate);
        // @ts-ignore
        const dueDateStr = formatDate(currentMonthDueDate);


        // Create PDF
        const doc = new PDFDocument({ margin: 50, size: 'A4' });

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=receipt_${payment.razorpayPaymentId}.pdf`);

        doc.pipe(res);

        // --- PDF Content ---

        // 1. Main Heading & Sub Heading
        doc.font('Helvetica-Bold').fontSize(24).text('FEE-FLOW', { align: 'center' });
        doc.moveDown(0.2);
        doc.font('Helvetica').fontSize(16).text('Fee Receipt', { align: 'center' });
        doc.moveDown(1.5);

        const startY = doc.y;

        // 2. Receipt Details (Left Aligned)
        doc.fontSize(10).font('Helvetica-Bold');
        doc.text(`Receipt Number:`, 50, startY);
        doc.font('Helvetica').text(`${payment._id.toString().slice(-6).toUpperCase()}`, 150, startY);

        doc.font('Helvetica-Bold').text(`Receipt Date:`, 50, startY + 15);
        doc.font('Helvetica').text(`${dateStr}`, 150, startY + 15);

        // 3. Student & Org Details (Below Receipt Details - Left)
        let detailsY = startY + 40;
        doc.font('Helvetica-Bold').text(`Student Name:`, 50, detailsY);
        doc.font('Helvetica').text(`${student.studentName}`, 150, detailsY);

        // @ts-ignore
        doc.font('Helvetica-Bold').text(`Organization:`, 50, detailsY + 15);
        // @ts-ignore
        doc.font('Helvetica').text(`${student.organizationId?.name || 'N/A'}`, 150, detailsY + 15);

        doc.font('Helvetica-Bold').text(`Transaction ID:`, 50, detailsY + 30);
        doc.font('Helvetica').text(`${payment.razorpayPaymentId || 'N/A'}`, 150, detailsY + 30);

        doc.font('Helvetica-Bold').text(`Razorpay Order ID:`, 50, detailsY + 45);
        doc.font('Helvetica').text(`${payment.razorpayOrderId}`, 150, detailsY + 45);


        // 4. Upcoming Payment Info (Right Aligned)
        // Calculating right side position (approx 350 onwards)
        const rightColX = 350;
        doc.font('Helvetica-Bold').text('Upcoming Payment Info:', rightColX, detailsY);
        doc.font('Helvetica').text(`Next Due Date: ${nextDueDateStr}`, rightColX, detailsY + 15);
        // @ts-ignore
        doc.text(`Projected Amount: $${student.amount}`, rightColX, detailsY + 30);


        // 5. Payment Table (Below everything)
        // Determine Y position based on the lowest element above (Upcoming Info or Details)
        // Details take up to detailsY + 45.
        const tableTop = detailsY + 80;

        // Table Header
        doc.font('Helvetica-Bold');
        doc.text('Description', 50, tableTop);
        doc.text('Amount Paid', 300, tableTop, { width: 100, align: 'right' });
        doc.text('Due Date', 430, tableTop, { width: 100, align: 'right' });

        doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

        // Table Rows
        doc.font('Helvetica');
        const rowTop = tableTop + 25;
        doc.text(`Fee Payment for ${paymentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}`, 50, rowTop);
        doc.text(`$${payment.amount}`, 300, rowTop, { width: 100, align: 'right' });
        doc.text(dueDateStr, 430, rowTop, { width: 100, align: 'right' });

        doc.moveTo(50, rowTop + 15).lineTo(550, rowTop + 15).strokeOpacity(0.5).stroke();

        // Total
        const totalTop = rowTop + 30;
        doc.font('Helvetica-Bold');
        doc.text('Total Paid', 200, totalTop, { align: 'right', width: 100 }); // Align label carefully
        doc.text(`$${payment.amount}`, 300, totalTop, { width: 100, align: 'right' });

        // Footer
        doc
            .fontSize(10)
            .text(
                'This is a computer-generated receipt and does not require a signature.',
                50,
                700,
                { align: 'center', width: 500 }
            );

        doc.end();

    } catch (error) {
        console.error("Error generating receipt:", error);
        res.status(500).json({ message: "Error generating receipt" });
    }
};
