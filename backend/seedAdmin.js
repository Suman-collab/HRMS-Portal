import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        console.log('DB connected for seeding...');

        let admin = await User.findOne({ role: 'admin' });
        if (!admin) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Admin@123', salt);
            admin = new User({
                employeeId: 'ADM-001',
                email: 'admin@dayflow.com',
                password: hashedPassword,
                role: 'admin',
                isVerified: true
            });
            await admin.save();
            console.log('Admin user created: admin@dayflow.com / Admin@123');
        } else {
            console.log('Admin already exists: ' + admin.email);
            const salt = await bcrypt.genSalt(10);
            admin.password = await bcrypt.hash('Admin@123', salt);
            await admin.save();
            console.log('Admin password reset to: Admin@123');
        }

        let emp = await User.findOne({ role: 'employee' });
        if (!emp) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash('Employee@123', salt);
            emp = new User({
                employeeId: 'EMP-001',
                email: 'employee@dayflow.com',
                password: hashedPassword,
                role: 'employee',
                isVerified: true
            });
            await emp.save();
            console.log('Employee user created: employee@dayflow.com / Employee@123');
        } else {
            console.log('Employee already exists: ' + emp.email);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
