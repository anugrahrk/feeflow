import express from 'express';
import {
    getMonthlyStats,
    getChartData,
    getTransactionHistory
} from '../controllers/adminStatsController.js';
import { verifyToken, assignRole, authorizeRoles } from '../middleware/auth.js';
import { UserRole } from '../models/User.js';

const router = express.Router();

// All routes require Admin role
router.use(verifyToken, assignRole, authorizeRoles([UserRole.ADMIN]));

router.get('/stats/monthly', getMonthlyStats);
router.get('/stats/chart', getChartData);
router.get('/transactions', getTransactionHistory);

export default router;
