import express from 'express';
import { verifyToken } from '../middleware/auth.js';
import { getStudentProfile, getStudentTransactions } from '../controllers/studentController.js';

const router = express.Router();

// Apply auth middleware to all routes
router.use(verifyToken);

router.get('/profile', getStudentProfile);
router.get('/transactions', getStudentTransactions);

export default router;
