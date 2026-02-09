import Razorpay from 'razorpay';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID || '',
    key_secret: process.env.RAZORPAY_KEY_SECRET || '',
});

export const createOrder = async (amount: number, receipt: string) => {
    const options = {
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        receipt,
    };
    return await instance.orders.create(options);
};

export const verifyPaymentSignature = (orderId: string, paymentId: string, signature: string) => {
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '');
    hmac.update(orderId + '|' + paymentId);
    const generatedSignature = hmac.digest('hex');
    return generatedSignature === signature;
};
