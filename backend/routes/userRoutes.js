import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { logAction } from '../middleware/auditMiddleware.js';
import { createAgency, createCoder, getCoders } from '../controllers/userController.js';

const router = express.Router();

// Routes strictly defined here
router.post('/agency', protect, authorizeRoles('superadmin'), logAction('CREATE_AGENCY'), createAgency);
router.post('/coder', protect, authorizeRoles('admin'), logAction('CREATE_CODER'), createCoder);
router.get('/coders', protect, authorizeRoles('admin'), getCoders);

export default router;