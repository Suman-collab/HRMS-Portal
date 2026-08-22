import Attendance from '../models/Attendance.js';
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
};