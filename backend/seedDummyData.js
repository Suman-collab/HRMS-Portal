import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

import User from './src/models/User.js';
import EmployeeProfile from './src/models/EmployeeProfile.js';
import Attendance from './src/models/Attendance.js';
import LeaveRequest from './src/models/LeaveRequest.js';
import Payroll from './src/models/Payroll.js';

const dummyNames = [
    { first: 'Alice', last: 'Johnson', role: 'employee' },
    { first: 'Bob', last: 'Smith', role: 'employee' },
    { first: 'Charlie', last: 'Davis', role: 'employee' },
    { first: 'Diana', last: 'Evans', role: 'employee' },
    { first: 'Ethan', last: 'Wright', role: 'employee' },
    { first: 'Fiona', last: 'Garcia', role: 'employee' }
];

async function seedData() {
    try {
        console.log('Connecting to database...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/hrms');
        console.log('Connected.');

        console.log('Clearing old dummy data...');
        const emails = dummyNames.map(d => `${d.first.toLowerCase()}@dayflow.com`);
        const existingUsers = await User.find({ email: { $in: emails } });
        const userIds = existingUsers.map(u => u._id);

        await User.deleteMany({ _id: { $in: userIds } });
        await EmployeeProfile.deleteMany({ userId: { $in: userIds } });
        await Attendance.deleteMany({ employeeId: { $in: userIds } });
        await LeaveRequest.deleteMany({ employeeId: { $in: userIds } });
        await Payroll.deleteMany({ employeeId: { $in: userIds } });

        const hashedPassword = await bcrypt.hash('employee@123', 10);

        console.log('Creating new dummy employees...');

        for (let i = 0; i < dummyNames.length; i++) {
            const dn = dummyNames[i];
            const email = `${dn.first.toLowerCase()}@dayflow.com`;

            // Create User
            const user = await User.create({
                employeeId: `EMP-${1000 + i}`,
                email,
                password: hashedPassword,
                role: dn.role,
                isVerified: true
            });

            // Create Profile
            await EmployeeProfile.create({
                userId: user._id,
                personalDetails: {
                    name: `${dn.first} ${dn.last}`,
                    DOB: new Date(1990 + i, i, 15),
                    phone: `555-010${i}`,
                    address: `${123 + i} Mockingbird Lane, Cityville`
                },
                jobDetails: {
                    designation: i % 2 === 0 ? 'Software Engineer' : 'Product Designer',
                    department: i % 2 === 0 ? 'Engineering' : 'Design',
                    joiningDate: new Date(2023, i, 1)
                },
                professionalInfo: {
                    employmentStatus: 'Active'
                },
                financialInfo: {
                    bankName: 'Dayflow Bank',
                    accountNumber: `XXXXXXXX${2200 + i}`,
                    ifscCode: 'DYF0001',
                    taxId: `ABCDE${1234 + i}F`
                }
            });

            // Create Payroll
            const basic = 4000 + (1000 * i);
            const allow = 500 + (100 * i);
            const deduc = 200 + (50 * i);
            await Payroll.create({
                employeeId: user._id,
                basicSalary: basic,
                allowances: allow,
                deductions: deduc,
                netSalary: basic + allow - deduc,
                month: new Date().getMonth() + 1,
                year: new Date().getFullYear()
            });

            // Create Attendance (Last 10 days)
            let presentCount = 0;
            let absentCount = 0;
            let halfDayCount = 0;

            for (let d = 10; d >= 1; d--) {
                const date = new Date();
                date.setDate(date.getDate() - d);
                // Skip weekends roughly
                if (date.getDay() === 0 || date.getDay() === 6) continue;

                const checkInDate = new Date(date);
                checkInDate.setHours(9, Math.floor(Math.random() * 30), 0);

                const checkOutDate = new Date(date);
                checkOutDate.setHours(17, Math.floor(Math.random() * 60) + 15, 0);

                let status = 'Present';
                // Randomize a bit
                const random = Math.random();
                if (random > 0.85) status = 'Absent';
                else if (random > 0.70) status = 'Half-day';

                await Attendance.create({
                    employeeId: user._id,
                    date: date,
                    checkIn: status === 'Absent' ? null : checkInDate,
                    checkOut: (status === 'Absent' || status === 'Half-day') ? null : checkOutDate,
                    status: status
                });
            }

            // Create Leaves
            if (i % 2 === 0) {
                await LeaveRequest.create({
                    employeeId: user._id,
                    leaveType: i === 0 ? 'Paid' : 'Sick',
                    startDate: new Date(new Date().getTime() + 86400000 * 5), // 5 days from now
                    endDate: new Date(new Date().getTime() + 86400000 * 7),
                    remarks: 'Personal reasons',
                    status: i === 0 ? 'Pending' : 'Approved'
                });
            }
            if (i % 3 === 0) {
                await LeaveRequest.create({
                    employeeId: user._id,
                    leaveType: 'Paid',
                    startDate: new Date(new Date().getTime() + 86400000 * 15),
                    endDate: new Date(new Date().getTime() + 86400000 * 16),
                    remarks: 'Vacation',
                    status: 'Pending'
                });
            }
        }

        console.log('Dummy data seeded successfully!');
        console.log('You can login as employees with:');
        dummyNames.forEach(dn => {
            console.log(`Email: ${dn.first.toLowerCase()}@dayflow.com | Password: employee@123`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Failed to seed dummy data:', error);
        process.exit(1);
    }
}

seedData();
