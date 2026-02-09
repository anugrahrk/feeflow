import express from 'express';
import {
    createStudent,
    getStudents,
    updateStudent,
    toggleStudentStatus,
    sendPaymentLinkEmail,
    generatePDFReport
} from '../controllers/adminController.js';
import { verifyToken, assignRole, authorizeRoles } from '../middleware/auth.js';
import { UserRole } from '../models/User.js';

const router = express.Router();

// All routes require Admin role
router.use(verifyToken, assignRole, authorizeRoles([UserRole.ADMIN]));

router.post('/students', createStudent);
router.get('/students', getStudents);
router.put('/students/:id', updateStudent);
router.patch('/students/:id/status', toggleStudentStatus);
router.post('/students/reminder/:id', sendPaymentLinkEmail);
router.get('/students/report/pdf', generatePDFReport);

export default router;
