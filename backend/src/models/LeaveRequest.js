import mongoose from 'mongoose';

const leaveRequestSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee (User) ID reference is required'],
      index: true,
    },
    leaveType: {
      type: String,
      enum: {
        values: ['Paid', 'Sick', 'Unpaid'],
        message: '{VALUE} is not a valid leave type. Allowed values: Paid, Sick, Unpaid',
      },
      required: [true, 'Leave type is required'],
    },
    startDate: {
      type: Date,
      required: [true, 'Leave start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'Leave end date is required'],
      validate: {
        validator: function (value) {
          return !this.startDate || value >= this.startDate;
        },
        message: 'End date must be greater than or equal to start date',
      },
    },
    remarks: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: {
        values: ['Pending', 'Approved', 'Rejected'],
        message: '{VALUE} is not a valid leave status. Allowed values: Pending, Approved, Rejected',
      },
      default: 'Pending',
      required: true,
    },
    adminComments: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const LeaveRequest = mongoose.model('LeaveRequest', leaveRequestSchema);

export default LeaveRequest;
