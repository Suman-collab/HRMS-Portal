import mongoose from 'mongoose';

const attendanceSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee (User) ID reference is required'],
      index: true,
    },
    date: {
      type: Date,
      required: [true, 'Attendance date is required'],
      index: true,
    },
    checkIn: {
      type: Date,
      default: null,
    },
    checkOut: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['Present', 'Absent', 'Half-day', 'Leave'],
        message: '{VALUE} is not a valid attendance status. Allowed values: Present, Absent, Half-day, Leave',
      },
      default: 'Present',
      required: [true, 'Attendance status is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Compound index to ensure fast querying per employee per date
attendanceSchema.index({ employeeId: 1, date: 1 });

const Attendance = mongoose.model('Attendance', attendanceSchema);

export default Attendance;
