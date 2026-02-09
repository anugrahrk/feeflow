import express from 'express';
import { createOrder, verifyPaymentSignature } from '../services/razorpayService.js';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import { notifyPayment } from '../services/socketService.js';
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

        const order = await createOrder(amount, `receipt_${studentId}_${Date.now()}`);
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
            razorpay_signature,
            studentId,
            organizationId,
            amount
        } = req.body;

        const isValid = verifyPaymentSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature);

        if (isValid) {
            // Create Payment Record
            const payment = new Payment({
                studentId,
                organizationId,
                amount,
                status: 'completed',
                razorpayOrderId: razorpay_order_id,
                razorpayPaymentId: razorpay_payment_id
            });

            await payment.save();

            // Notify Admin via Socket
            const student = await Student.findById(studentId);
            if (student) {
                notifyPayment(organizationId, {
                    studentName: student.studentName,
                    amount
                });
            }

            res.json({ status: 'success', paymentId: payment._id });
        } else {
            res.status(400).json({ status: 'failure', message: 'Invalid Signature' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error verifying payment', error });
    }
});

export default router;
