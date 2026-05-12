import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail', // Or use host/port from env
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

export const sendPaymentLink = async (email: string, name: string, link: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Fee Payment Link',
        html: `
      <h3>Hello ${name},</h3>
      <p>Please use the following link to pay your fee:</p>
      <a href="${link}">Pay Now</a>
      <p>Thank you.</p>
    `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Payment link sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

export const sendReminder = async (email: string, name: string, amount: number) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Fee Payment Reminder',
        html: `
      <h3>Hello ${name},</h3>
      <p>This is a reminder that your fee payment of <strong>${amount}</strong> is due.</p>
      <p>Please pay as soon as possible.</p>
    `
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log(`Reminder sent to ${email}`);
    } catch (error) {
        console.error('Error sending reminder:', error);
    }
}
