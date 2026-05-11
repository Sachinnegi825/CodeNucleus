import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { getBranding, getPublicProfile, updateBranding, toggleOrgStatus } from '../controllers/orgController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Keep in RAM for AWS transfer

router.get('/branding', protect, authorizeRoles('admin'), getBranding);
router.get('/public-profile/:subdomain', getPublicProfile);

// Superadmin only route to toggle organization status
router.patch('/:id/status', protect, authorizeRoles('superadmin'), toggleOrgStatus);

router.put('/branding', protect, authorizeRoles('admin'), upload.single('logo'), updateBranding);

export default router;