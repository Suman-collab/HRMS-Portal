import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // Stub placeholder
  auth: { user: process.env.EMAIL_USER || 'stub@example.com', pass: process.env.EMAIL_PASS || 'stub' }
});

export const sendLeaveEmail = async (to, subject, html) => {
  try {
    await transporter.sendMail({ from: process.env.EMAIL_USER || 'admin@dayflow.com', to, subject, html });
  } catch (err) {
    console.error('Email failed, but catching to prevent failure:', err);
  }
};