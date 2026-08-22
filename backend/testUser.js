import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';

dotenv.config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(async () => {
        const user = await User.findOne({ email: 'admin@dayflow.com' });
        console.log("User found:", user ? "YES" : "NO");
        if (user) {
            console.log("Hashed password in DB:", user.password);
            const isMatch = await bcrypt.compare('Admin@123', user.password);
            console.log("Password matches:", isMatch ? "YES" : "NO");
        }
        process.exit(0);
    }).catch(err => {
        console.error(err);
        process.exit(1);
    });
