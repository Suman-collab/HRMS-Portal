import mongoose from 'mongoose';

const payrollSchema = new mongoose.Schema(
  {
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Employee (User) ID reference is required'],
      index: true,
    },
    basicSalary: {
      type: Number,
      required: [true, 'Basic salary is required'],
      min: [0, 'Basic salary cannot be negative'],
    },
    allowances: {
      type: Number,
      min: [0, 'Allowances cannot be negative'],
      default: 0,
    },
    deductions: {
      type: Number,
      min: [0, 'Deductions cannot be negative'],
      default: 0,
    },
    netSalary: {
      type: Number,
      required: [true, 'Net salary is required'],
      min: [0, 'Net salary cannot be negative'],
    },
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate netSalary automatically if not explicitly given or on updates
payrollSchema.pre('validate', function (next) {
  if (this.basicSalary !== undefined) {
    const basic = Number(this.basicSalary) || 0;
    const allow = Number(this.allowances) || 0;
    const ded = Number(this.deductions) || 0;
    this.netSalary = Math.max(0, basic + allow - ded);
    this.lastUpdated = new Date();
  }
  next();
});

const Payroll = mongoose.model('Payroll', payrollSchema);

export default Payroll;
