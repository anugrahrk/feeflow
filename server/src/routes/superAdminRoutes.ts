import express from 'express';
import {
    createOrganization,
    getOrganizationStats,
    getAllOrganizations,
    updateOrganization,
    toggleOrganizationStatus
} from '../controllers/superAdminController.js';
import { verifyToken, assignRole, authorizeRoles } from '../middleware/auth.js';
import { UserRole } from '../models/User.js';

const router = express.Router();

// Middleware applied to all routes in this router
router.use(verifyToken, assignRole, authorizeRoles([UserRole.SUPER_ADMIN]));

router.post('/organizations', createOrganization);
router.get('/organizations/stats', getOrganizationStats);
router.get('/organizations', getAllOrganizations);
router.put('/organizations/:id', updateOrganization);
router.patch('/organizations/:id/status', toggleOrganizationStatus);

export default router;
