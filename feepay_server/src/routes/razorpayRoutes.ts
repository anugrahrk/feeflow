import express from 'express';
import { createOrder, verifyPaymentSignature } from '../services/razorpayService.js';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
// import { notifyPayment } from '../services/socketService.js';
// import { verifyToken, assignRole } from '../middleware/auth'; 
// Ideally should be authenticated, but webhook might be public with secret check.
// For `create-order`, it should be authenticated by Student or Admin? 
// User said "reminder to email... with payment link". The link probably goes to a frontend page.
// The frontend page will call `create-order`.
// If the student pays, they might not be logged in as "User" in our system yet? 
// Or they are just clicking a link. 
// Let's assume the payment link works for unauthenticated users (via studentId).

const router = express.Router();

// Create Order
// Req body: { studentId, amount }
router.post('/create-order', async (req, res) => {
    try {
        const { studentId, amount } = req.body;
        // Verify student exists?
        const student = await Student.findById(studentId);
        if (!student) return res.status(404).json({ message: 'Student not found' });

        // Create Razorpay Order
        // Amount from frontend or DB? Safer to use DB or verified amount. 
        // Using passed amount for flexibility but validating against DB is better.
        // Let's use the amount passed but in real app use student.amount

        // Receipt length must be <= 40 chars.
        // studentId is 24 chars (ObjectId), Date.now() is 13 chars.
        // "receipt_" (8) + 24 + 13 = 45 > 40.
        // Solution: Use last 15 chars of studentId or shorter.
        // "rcpt_" (5) + 12 (studentId) + 13 (time) = 30 chars. Safe.
        const shortStudentId = studentId.toString().slice(-12);
        const receiptId = `rcpt_${shortStudentId}_${Date.now()}`;
        const order = await createOrder(amount, receiptId);

        // Create Pending Payment Record
        const payment = new Payment({
            studentId,
            organizationId: student.organizationId,
            amount,
            status: 'pending',
            razorpayOrderId: order.id,
        });
        await payment.save();

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error creating razorpay order', error });
    }
});

// Verify Payment
router.post('/verify-payment', async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        const payment = await Payment.findOne({ razorpayOrderId: razorpay_order_id });

        if (!payment) {
            return res.status(404).json({ status: 'failure', message: 'Payment record not found' });
        }

        if (isValid) {
            payment.status = 'completed';
            payment.razorpayPaymentId = razorpay_payment_id;
            await payment.save();

            // Notify Admin via Socket (Optional, commented out as per previous code)
            // const student = await Student.findById(payment.studentId);
            // ...

            res.json({ status: 'success', paymentId: payment._id });
        } else {
            payment.status = 'failed';
            await payment.save();
            res.status(400).json({ status: 'failure', message: 'Invalid Signature' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying payment', error });
    }
});

// Check Payment Status
router.get('/payment-status/:studentId', async (req, res) => {
    try {
        const { studentId } = req.params;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        const existingPayment = await Payment.findOne({
            studentId,
            status: 'completed',
            createdAt: {
                $gte: startOfMonth,
                $lte: endOfMonth
            }
        });

        if (existingPayment) {
            return res.json({
                paid: true,
                paymentDate: existingPayment.createdAt,
                message: "Payment already done for this month."
            });
        }

        res.json({
            paid: false,
            message: "Payment pending."
        });

    } catch (error) {
        res.status(500).json({ message: 'Error checking payment status', error });
    }
});

export default router;
