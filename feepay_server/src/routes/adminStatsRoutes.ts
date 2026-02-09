import express from 'express';
import {
    getMonthlyStats,
    getChartData,
    getTransactionHistory
} from '../controllers/adminStatsController.js';
import { verifyToken, assignRole, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require Admin role
router.use(verifyToken, assignRole, requireRole('admin'));

router.get('/stats/monthly', getMonthlyStats);
router.get('/stats/chart', getChartData);
router.get('/transactions', getTransactionHistory);

export default router;
