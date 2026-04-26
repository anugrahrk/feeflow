import nodemailer from 'nodemailer';

// Helper function to get the transporter only when needed
const getTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

export const sendPaymentLink = async (email: string, name: string, link: string) => {
    // 1. Move the transporter creation INSIDE the function
    const transporter = getTransporter();

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
    // 2. Do the same here
    const transporter = getTransporter();

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