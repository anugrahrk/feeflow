import cron from 'node-cron';
import Student from '../models/Student.js';
import Payment from '../models/Payment.js';
import { sendPaymentLink } from './emailService.js';
import mongoose from 'mongoose';

export const initScheduler = () => {
    // Schedule: 9:30 AM Daily
    cron.schedule('30 9 * * *', async () => {
        console.log('Running daily payment reminder scheduler...');
        try {
            const now = new Date();
            const currentDay = now.getDate();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            // 1. Find all enabled students
            const students = await Student.find({ isEnabled: true });

            for (const student of students) {
                const feeDate = new Date(student.feeRecurringDate);
                const recurringDay = feeDate.getDate();

                // 2. Check if fee date is today or passed for this month
                // Simple logic: If today's day >= recurring day, it's due/overdue for this month
                // (Assuming monthly recurrence)

                if (currentDay >= recurringDay) {
                    // 3. Check if paid this month
                    const startOfMonth = new Date(currentYear, currentMonth, 1);
                    const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

                    const payment = await Payment.findOne({
                        studentId: student._id,
                        status: 'completed',
                        createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                    });

                    if (!payment) {
                        // Not paid yet. Send Reminder.
                        if (student.email) {
                            // Generate Link
                            const paymentLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/pay/${student._id}`;
                            console.log(`Sending auto-reminder to ${student.studentName} (${student.email})`);
                            await sendPaymentLink(student.email, student.studentName, paymentLink);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in scheduler:', error);
        }
    });
};
