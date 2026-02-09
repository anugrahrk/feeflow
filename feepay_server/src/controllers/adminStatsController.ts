import { Request, Response } from 'express';
import Payment from '../models/Payment.js';
import Student from '../models/Student.js';
import mongoose from 'mongoose';

// Monthly Stats
export const getMonthlyStats = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        if (!organizationId) return res.status(403).json({ message: 'Organization ID missing' });

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // 1. Total Collection This Month
        const startOfMonth = new Date(currentYear, currentMonth, 1);
        const endOfMonth = new Date(currentYear, currentMonth + 1, 0, 23, 59, 59);

        const currentMonthPayments = await Payment.aggregate([
            {
                $match: {
                    organizationId: new mongoose.Types.ObjectId(organizationId),
                    status: 'completed',
                    createdAt: { $gte: startOfMonth, $lte: endOfMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        const totalCollection = currentMonthPayments[0]?.total || 0;
        const totalPaymentsCount = currentMonthPayments[0]?.count || 0;

        // 2. Last Month Collection for Growth %
        const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        const startOfLastMonth = new Date(lastMonthYear, lastMonth, 1);
        const endOfLastMonth = new Date(lastMonthYear, lastMonth + 1, 0, 23, 59, 59);

        const lastMonthPayments = await Payment.aggregate([
            {
                $match: {
                    organizationId: new mongoose.Types.ObjectId(organizationId),
                    status: 'completed',
                    createdAt: { $gte: startOfLastMonth, $lte: endOfLastMonth }
                }
            },
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);

        const lastMonthTotal = lastMonthPayments[0]?.total || 0;
        let growthPercentage = 0;

        if (lastMonthTotal === 0) {
            growthPercentage = totalCollection > 0 ? 100 : 0;
        } else {
            growthPercentage = ((totalCollection - lastMonthTotal) / lastMonthTotal) * 100;
        }

        // 3. Pending Payments logic
        // Logic: Active Students whose Recurring Date (Day) has passed this month and HAVEN'T paid.
        // If recurring date is 15th, and today is 10th, it's not pending yet? "recuring days has passed".
        // "where the recuring days has passed and not yet payed"
        // So we check students where Day(feeRecurringDate) <= Today AND Valid Payment not found in current month.

        const todayDay = now.getDate();

        // Find all active students for this org
        const students = await Student.find({
            organizationId,
            isEnabled: true
        });

        let pendingCount = 0;

        // We already fetched currentMonthPayments, but we need details to check studentIds.
        // Let's fetch the list of studentIds who paid this month.
        const paidStudentIds = await Payment.distinct('studentId', {
            organizationId,
            status: 'completed',
            createdAt: { $gte: startOfMonth, $lte: endOfMonth }
        });

        const paidStudentIdsSet = new Set(paidStudentIds.map((id: any) => id.toString()));

        students.forEach((student: any) => {
            const recurringDay = new Date(student.feeRecurringDate).getDate();
            // Check if day has passed or is today
            if (recurringDay <= todayDay) {
                // Check if they paid
                if (!paidStudentIdsSet.has(student._id.toString())) {
                    pendingCount++;
                }
            }
        });

        res.json({
            totalCollection,
            growthPercentage: parseFloat(growthPercentage.toFixed(2)),
            totalPaymentsCount,
            pendingPayments: pendingCount
        });

    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error });
    }
};

// 6 Month Chart Data
export const getChartData = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        if (!organizationId) return res.status(403).json({ message: 'Organization ID missing' });

        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); // 5 months back + current = 6
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const payments = await Payment.aggregate([
            {
                $match: {
                    organizationId: new mongoose.Types.ObjectId(organizationId),
                    status: 'completed',
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: {
                        month: { $month: '$createdAt' },
                        year: { $year: '$createdAt' }
                    },
                    total: { $sum: '$amount' }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format for frontend (e.g., "Jan", "Feb")
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const formattedData = payments.map((p: any) => ({
            name: `${months[p._id.month - 1]} ${p._id.year}`,
            total: p.total
        }));

        // Should we fill missing months with 0? Good practice.
        // Leaving simple for now as per requirement "gives the total amount recieved per montht for last 6 months".

        res.json(formattedData);

    } catch (error) {
        res.status(500).json({ message: 'Error fetching chart data', error });
    }
};

// Transactions History
export const getTransactionHistory = async (req: Request, res: Response) => {
    try {
        const organizationId = req.organizationId;
        if (!organizationId) return res.status(403).json({ message: 'Organization ID missing' });

        const page = parseInt(req.query.page as string) || 1;
        const limit = 5;

        const total = await Payment.countDocuments({ organizationId });
        const transactions = await Payment.find({ organizationId })
            .populate('studentId', 'studentName email') // Get student details
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({
            data: transactions,
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
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
};
