import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { getBranding, updateBranding } from '../controllers/orgController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); // Keep in RAM for AWS transfer

router.get('/branding', protect, authorizeRoles('admin'), getBranding);

router.put('/branding', protect, authorizeRoles('admin'), upload.single('logo'), updateBranding);

export default router;