import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { logAction } from '../middleware/auditMiddleware.js';
import { createAgency, createCoder, getAuditLogs, getCoders, getAgencies, toggleUserStatus, updateCoderPassword } from '../controllers/userController.js';
import { exportFHIR } from '../controllers/encounterController.js';

const router = express.Router();

// Routes strictly defined here
router.post('/agency', protect, authorizeRoles('superadmin'), logAction('CREATE_AGENCY'), createAgency);
router.get('/agencies', protect, authorizeRoles('superadmin'), getAgencies);

router.post('/coder', protect, authorizeRoles('admin'), logAction('CREATE_CODER'), createCoder);
router.get('/coders', protect, authorizeRoles('admin'), getCoders);

router.patch('/:id/password', protect, authorizeRoles('admin', 'superadmin'), logAction('UPDATE_PASSWORD'), updateCoderPassword);
router.patch('/:id/status', protect, authorizeRoles('admin', 'superadmin'), toggleUserStatus);

router.get('/audit-logs', protect, authorizeRoles('admin'), getAuditLogs);
router.get('/:id/export', protect, authorizeRoles('admin'), logAction('COMPLIANCE_PURGE_AND_EXPORT'), exportFHIR);



export default router;