import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

export function sendResetMail(email, token) {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'TAC - Reset Your Password',
    text: `Your password reset link is: http://localhost:3000/reset/${token}`,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      throw error;
    }
  });
}

export function sendResetConfirmMail(email) {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: 'TAC - Password Reset',
    text: `Your password was successfully reset`,
  };
  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      throw error;
    }
  });
}
