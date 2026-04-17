import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { authorizeRoles } from '../middleware/roleMiddleware.js';
import { createRule, getRules, deleteRule } from '../controllers/payerRuleController.js';

const router = express.Router();

router.post('/', protect, authorizeRoles('admin'), createRule);
router.get('/', protect, authorizeRoles('admin'), getRules);
router.delete('/:id', protect, authorizeRoles('admin'), deleteRule);

export default router;