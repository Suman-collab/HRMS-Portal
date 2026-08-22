import express from 'express';
import { getEmployees } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

// Route: GET /api/admin/employees
// Protected and Authorized for 'admin' only
router.route('/employees').get(protect, authorize('admin'), getEmployees);

export default router;
