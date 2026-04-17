import express from 'express';
import multer from 'multer';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { logAction } from '../middleware/auditMiddleware.js';
import { uploadRecord, getEncounters, viewRecord, scrubRecord, analyzeEncounter, updateEncounter, exportFHIR, getCoderStats, getAdminStats } from '../controllers/encounterController.js';

const router = express.Router();

// Only accept PDFs, keep in RAM to stream to AWS
const upload = multer({ 
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') cb(null, true);
    else cb(new Error('Only PDFs are allowed for medical records'), false);
  }
});

// Routes for Coders & Admins
router.post('/upload', protect, authorizeRoles('admin', 'coder'), logAction('UPLOAD_RECORD'), upload.single('file'), uploadRecord);
router.get('/', protect, authorizeRoles('admin', 'coder'), logAction('VIEW_ENCOUNTER_LIST'), getEncounters);
router.get('/:id/view', protect, authorizeRoles('admin', 'coder'), logAction('GENERATE_PRESIGNED_URL'), viewRecord);
router.post('/:id/scrub', protect, authorizeRoles('admin', 'coder'), logAction('SCRUB_PHI'), scrubRecord);
router.post('/:id/analyze', protect, authorizeRoles('admin', 'coder'), logAction('RUN_AI_ANALYSIS'), analyzeEncounter);
router.put('/:id', protect, authorizeRoles('admin', 'coder'), logAction('UPDATE_ENCOUNTER'), updateEncounter);
router.get('/:id/export', protect, authorizeRoles('admin', 'coder'), exportFHIR);
router.get('/stats/performance', protect, authorizeRoles('coder', 'admin'), getCoderStats);
router.get('/stats/admin-overview', protect, authorizeRoles('admin'), getAdminStats);




export default router;