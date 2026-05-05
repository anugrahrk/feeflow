import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { clerkMiddleware } from '@clerk/express';
import dotenv from 'dotenv';

import superAdminRoutes from './routes/superAdminRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import razorpayRoutes from './routes/razorpayRoutes.js';
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.CLIENT_URI,
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(clerkMiddleware());

// Health check - AWS load balancer will ping this
app.get('/', (req, res) => {
    res.json({ message: 'FeeFlow API running', status: 'ok' });
});

// DB Connection
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '', {
            maxPoolSize: 10
        });
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1);
    }
};

app.use('/api/auth', authRoutes);
app.use('/api/su', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/payments', razorpayRoutes);
app.use('/api/student', studentRoutes);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});