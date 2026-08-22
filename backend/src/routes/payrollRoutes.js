import express from 'express';
import { getPayroll, updatePayroll, downloadSalarySlip } from '../controllers/payrollController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/:employeeId/slip', downloadSalarySlip);
router.get('/:employeeId', getPayroll);
router.put('/:employeeId', authorize('admin'), updatePayroll);

export default router;