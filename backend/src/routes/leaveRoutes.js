import express from 'express';
import { applyLeave, getLeaves, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/apply', applyLeave);
router.get('/', getLeaves);
router.put('/:id/status', authorize('admin'), updateLeaveStatus);

export default router;