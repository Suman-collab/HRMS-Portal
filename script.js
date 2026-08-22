const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'backend', 'src');

const files = {
    // 1. Email Util
    "utils/email.js": `import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Stub placeholder
  auth: { user: process.env.EMAIL_USER || 'stub@example.com', pass: process.env.EMAIL_PASS || 'stub' }
});

export const sendLeaveEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER || 'admin@dayflow.com', to, subject, html });
  } catch (err) {
    console.error('Email failed, but catching to prevent failure:', err);
  }
};`,

    // 2. Attendance Controller
    "controllers/attendanceController.js": `import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

export const checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let record = await Attendance.findOne({ employeeId: req.user._id, date: { $gte: today } });
    if (record && record.checkIn) {
      return res.status(400).json({ success: false, message: 'Already checked in today' });
    }

    if (!record) {
      record = new Attendance({ employeeId: req.user._id, date: new Date(), checkIn: new Date(), status: 'Present' });
    } else {
      record.checkIn = new Date();
      record.status = 'Present';
    }
    
    await record.save();
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkOut = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const record = await Attendance.findOne({ employeeId: req.user._id, date: { $gte: today } });
    if (!record || !record.checkIn) {
      return res.status(400).json({ success: false, message: 'No check-in found for today' });
    }

    record.checkOut = new Date();
    const hours = (record.checkOut - record.checkIn) / (1000 * 60 * 60);
    record.status = hours >= 6 ? 'Present' : 'Half-day';
    
    await record.save();
    res.status(200).json({ success: true, data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getEmployeeAttendance = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { startDate, endDate } = req.query;

    if (req.user.role !== 'admin' && req.user._id.toString() !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    let filter = { employeeId };
    if (startDate && endDate) {
      filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const records = await Attendance.find(filter).sort({ date: -1 }).lean();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAllAttendance = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    const records = await Attendance.find().populate('employeeId', 'employeeId email role').sort({ date: -1 }).skip((page - 1) * limit).limit(limit).lean();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`,

    // 3. Leave Controller
    "controllers/leaveController.js": `import LeaveRequest from '../models/LeaveRequest.js';
import User from '../models/User.js';
import { sendLeaveEmail } from '../utils/email.js';

export const applyLeave = async (req, res) => {
  try {
    const { leaveType, startDate, endDate, remarks } = req.body;
    const leave = new LeaveRequest({ employeeId: req.user._id, leaveType, startDate, endDate, remarks, status: 'Pending' });
    await leave.save();
    res.status(201).json({ success: true, data: leave });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const getLeaves = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    let filter = {};
    if (req.user.role !== 'admin') {
      filter.employeeId = req.user._id;
    }
    if (status) filter.status = status;

    const records = await LeaveRequest.find(filter).populate('employeeId', 'employeeId email role').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit).lean();
    res.status(200).json({ success: true, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateLeaveStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, adminComments } = req.body;

    const leave = await LeaveRequest.findById(id).populate('employeeId');
    if (!leave) return res.status(404).json({ success: false, message: 'Leave not found' });
    if (leave.status !== 'Pending') return res.status(400).json({ success: false, message: 'Only Pending leaves can be updated' });

    leave.status = status;
    if (adminComments) leave.adminComments = adminComments;
    await leave.save();

    // Send email
    if (leave.employeeId && leave.employeeId.email) {
      const emailBody = \`
        <h3>Leave Request \${status}</h3>
        <p>Type: \${leave.leaveType}</p>
        <p>From: \${leave.startDate.toDateString()} To: \${leave.endDate.toDateString()}</p>
        <p>Admin Comments: \${adminComments || 'None'}</p>
      \`;
      await sendLeaveEmail(leave.employeeId.email, \`Your Leave Request is \${status}\`, emailBody);
    }

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`,

    // 4. Payroll Controller
    "controllers/payrollController.js": `import Payroll from '../models/Payroll.js';
import User from '../models/User.js';
import PDFDocument from 'pdfkit';

export const getPayroll = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    let payroll = await Payroll.findOne({ employeeId }).lean();
    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updatePayroll = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const { basicSalary, allowances, deductions } = req.body;

    if (Number(basicSalary) < 0 || Number(allowances) < 0 || Number(deductions) < 0) {
      return res.status(400).json({ success: false, message: 'Negative values not allowed' });
    }

    let payroll = await Payroll.findOne({ employeeId });
    if (!payroll) {
      payroll = new Payroll({ employeeId });
    }

    payroll.basicSalary = basicSalary;
    payroll.allowances = allowances;
    payroll.deductions = deductions;
    // pre-save hook calculates netSalary
    await payroll.save();

    res.status(200).json({ success: true, data: payroll });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const downloadSalarySlip = async (req, res) => {
  try {
    const { employeeId } = req.params;
    if (req.user.role !== 'admin' && req.user._id.toString() !== employeeId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }

    const payroll = await Payroll.findOne({ employeeId }).populate('employeeId', 'employeeId email role');
    if (!payroll) return res.status(404).json({ success: false, message: 'Payroll data not found' });

    const doc = new PDFDocument();
    res.setHeader('Content-disposition', \`attachment; filename=Salary_Slip_\${payroll.employeeId.employeeId}.pdf\`);
    res.setHeader('Content-type', 'application/pdf');

    doc.pipe(res);
    doc.fontSize(20).text('Salary Slip', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(\`Employee ID: \${payroll.employeeId.employeeId}\`);
    doc.text(\`Email: \${payroll.employeeId.email}\`);
    doc.moveDown();
    doc.text(\`Basic Salary: $\${payroll.basicSalary}\`);
    doc.text(\`Allowances: $\${payroll.allowances}\`);
    doc.text(\`Deductions: $\${payroll.deductions}\`);
    doc.moveDown();
    doc.fontSize(14).text(\`Net Salary: $\${payroll.netSalary}\`, { underline: true });
    doc.end();
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`,

    // 5. Analytics (appended to admin)
    "controllers/analyticsController.js": `import Attendance from '../models/Attendance.js';
import LeaveRequest from '../models/LeaveRequest.js';

export const getAnalytics = async (req, res) => {
  try {
    // Attendance Summary for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const attendances = await Attendance.find({ date: { $gte: thirtyDaysAgo } }).lean();
    const attendanceSummary = { Present: 0, Absent: 0, 'Half-day': 0, Leave: 0 };
    attendances.forEach(a => {
      if (attendanceSummary[a.status] !== undefined) attendanceSummary[a.status]++;
    });

    // Leave Stats
    const leaves = await LeaveRequest.find().lean();
    const leaveStats = { Paid: { Pending: 0, Approved: 0, Rejected: 0 }, Sick: { Pending: 0, Approved: 0, Rejected: 0 }, Unpaid: { Pending: 0, Approved: 0, Rejected: 0 } };
    
    leaves.forEach(l => {
      if (leaveStats[l.leaveType] && leaveStats[l.leaveType][l.status] !== undefined) {
        leaveStats[l.leaveType][l.status]++;
      }
    });

    res.status(200).json({ success: true, data: { attendanceSummary, leaveStats } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};`,

    // Routes
    "routes/attendanceRoutes.js": `import express from 'express';
import { checkIn, checkOut, getEmployeeAttendance, getAllAttendance } from '../controllers/attendanceController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/checkin', checkIn);
router.post('/checkout', checkOut);
router.get('/', authorize('admin'), getAllAttendance);
router.get('/:employeeId', getEmployeeAttendance);

export default router;`,

    "routes/leaveRoutes.js": `import express from 'express';
import { applyLeave, getLeaves, updateLeaveStatus } from '../controllers/leaveController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.post('/apply', applyLeave);
router.get('/', getLeaves);
router.put('/:id/status', authorize('admin'), updateLeaveStatus);

export default router;`,

    "routes/payrollRoutes.js": `import express from 'express';
import { getPayroll, updatePayroll, downloadSalarySlip } from '../controllers/payrollController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();
router.use(protect);

router.get('/:employeeId/slip', downloadSalarySlip);
router.get('/:employeeId', getPayroll);
router.put('/:employeeId', authorize('admin'), updatePayroll);

export default router;`

};

// Create files
for (const [relativePath, content] of Object.entries(files)) {
    const fullPath = path.join(srcDir, relativePath);
    fs.mkdirSync(path.dirname(fullPath), { recursive: true });
    fs.writeFileSync(fullPath, content);
}

console.log("Backend files generated successfully.");
