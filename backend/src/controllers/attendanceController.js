import Attendance from '../models/Attendance.js';
import User from '../models/User.js';

export const checkIn = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    let record = await Attendance.findOne({ employeeId: req.user._id, date: { $gte: today, $lt: tomorrow } });
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
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const record = await Attendance.findOne({ employeeId: req.user._id, date: { $gte: today, $lt: tomorrow } });
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
};