import LeaveRequest from '../models/LeaveRequest.js';
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
      const emailBody = `
        <h3>Leave Request ${status}</h3>
        <p>Type: ${leave.leaveType}</p>
        <p>From: ${leave.startDate.toDateString()} To: ${leave.endDate.toDateString()}</p>
        <p>Admin Comments: ${adminComments || 'None'}</p>
      `;
      await sendLeaveEmail(leave.employeeId.email, `Your Leave Request is ${status}`, emailBody);
    }

    res.status(200).json({ success: true, data: leave });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};