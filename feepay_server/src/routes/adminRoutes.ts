import express from 'express';
import {
    createStudent,
    getStudents,
    updateStudent,
    toggleStudentStatus,
    sendPaymentLinkEmail,
    generatePDFReport
} from '../controllers/adminController.js';
import { verifyToken, assignRole, requireRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require Admin role
router.use(verifyToken, assignRole, requireRole('admin'));

router.post('/students', createStudent);
router.get('/students', getStudents);
router.put('/students/:id', updateStudent);
router.patch('/students/:id/status', toggleStudentStatus);
router.post('/students/reminder/:id', sendPaymentLinkEmail);
router.get('/students/report/pdf', generatePDFReport);

export default router;
