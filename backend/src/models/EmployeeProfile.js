import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Document name is required'],
      trim: true,
    },
    fileUrl: {
      type: String,
      required: [true, 'Document file URL is required'],
      trim: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const employeeProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
      index: true,
    },
    personalDetails: {
      name: {
        type: String,
        required: [true, 'Employee full name is required'],
        trim: true,
      },
      DOB: {
        type: Date,
        validate: {
          validator: function (value) {
            return !value || value < new Date();
          },
          message: 'Date of birth must be in the past',
        },
      },
      address: {
        type: String,
        trim: true,
        default: '',
      },
      phone: {
        type: String,
        trim: true,
        match: [
          /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/,
          'Please provide a valid phone number',
        ],
        default: '',
      },
    },
    jobDetails: {
      designation: {
        type: String,
        required: [true, 'Designation is required'],
        trim: true,
      },
      department: {
        type: String,
        required: [true, 'Department is required'],
        trim: true,
      },
      joiningDate: {
        type: Date,
        default: Date.now,
        required: [true, 'Joining date is required'],
      },
    },
    salaryStructure: {
      basic: {
        type: Number,
        required: [true, 'Basic salary is required'],
        min: [0, 'Basic salary cannot be negative'],
        default: 0,
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
    },
    documents: [documentSchema],
    profilePicture: {
      type: String,
      default: '',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const EmployeeProfile = mongoose.model('EmployeeProfile', employeeProfileSchema);

export default EmployeeProfile;
