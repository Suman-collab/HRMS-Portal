import express from 'express';
import { getEmployees } from '../controllers/adminController.js';
import { getAnalytics } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Route: GET /api/admin/employees
// Protected and Authorized for 'admin' only
router.route('/employees').get(protect, authorize('admin'), getEmployees);
router.route('/analytics').get(protect, authorize('admin'), getAnalytics);

export default router;
