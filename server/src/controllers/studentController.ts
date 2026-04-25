import { Request, Response } from 'express';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';

export const getStudentProfile = async (req: Request, res: Response) => {
    try {
        const email = req.clerkUser?.emailAddresses.find(
            (e) => e.id === req.clerkUser?.primaryEmailAddressId
        )?.emailAddress;

        if (!email) {
            return res.status(400).json({ message: "Email not found in token" });
        }

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ message: "Student profile not found" });
        }

        // Calculate outstanding balance (basic logic for now: if enabled, show monthly amount)
        // In a real app, we'd check if current month is paid.
        // For now, let's assume if no payment for current month, show amount.
        const currentMonthStart = new Date();
        currentMonthStart.setDate(1);
        currentMonthStart.setHours(0, 0, 0, 0);

        const currentMonthPayment = await Payment.findOne({
            studentId: student._id,
            createdAt: { $gte: currentMonthStart },
            status: 'completed'
        });

        const outstandingBalance = currentMonthPayment ? 0 : student.amount;

        res.status(200).json({
            student,
            outstandingBalance,
            isPaidForCurrentMonth: !!currentMonthPayment
        });
    } catch (error) {
        console.error("Error fetching student profile:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export const getStudentTransactions = async (req: Request, res: Response) => {
    try {
        const email = req.clerkUser?.emailAddresses.find(
            (e) => e.id === req.clerkUser?.primaryEmailAddressId
        )?.emailAddress;

        if (!email) {
            return res.status(400).json({ message: "Email not found in token" });
        }

        const student = await Student.findOne({ email });

        if (!student) {
            return res.status(404).json({ message: "Student profile not found" });
        }

        const transactions = await Payment.find({ studentId: student._id })
            .sort({ createdAt: -1 })
            .limit(10); // Limit to last 10 for dashboard

        res.status(200).json(transactions);
    } catch (error) {
        console.error("Error fetching transactions:", error);
        res.status(500).json({ message: "Server error" });
    }
};
