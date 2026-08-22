import express from 'express';
import { checkIn, checkOut, getEmployeeAttendance, getAllAttendance } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/', authorize('admin'), getAllAttendance);
router.get('/:employeeId', getEmployeeAttendance);

export default router;