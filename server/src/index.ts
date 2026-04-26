import express from "express";
import cors from 'cors';
import mongoose from "mongoose";
import { clerkMiddleware } from '@clerk/express';
import { createServer } from 'node:http';                  // ← ADD THIS
import { httpServerHandler } from 'cloudflare:node';

// Import your routes
import superAdminRoutes from './routes/superAdminRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import razorpayRoutes from "./routes/razorpayRoutes.js";
import authRoutes from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';

const app = express();

// 1. Trust Proxy (Crucial for Cloudflare)
app.set('trust proxy', true);

app.use(cors({
    origin: process.env.CLIENT_URI,
    optionsSuccessStatus: 200
}));

// Edge-safe JSON parsing middleware (Bypasses iconv-lite crash)
app.use((req, res, next) => {
    if (req.headers['content-type']?.includes('application/json')) {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            try {
                req.body = body ? JSON.parse(body) : {};
                next();
            } catch (err) {
                return res.status(400).json({ error: 'Invalid JSON format' });
            }
        });
    } else {
        next();
    }
});

// 2. R2 Serving Route
app.get('/upload/:filename', async (req, res) => {
    const bucket = (process.env as any).feepay_uploads;
    if (!bucket) return res.status(500).send("Bucket binding missing");
    
    const file = await bucket.get(req.params.filename);
    if (!file) return res.status(404).send('Report not found or expired.');

    const buffer = await file.arrayBuffer();
    res.setHeader('Content-Type', 'application/pdf');
    return res.send(Buffer.from(buffer));
});

app.get('/', (req, res) => {
    res.json({ message: "Express + TypeScript on Cloudflare Workers!" });
});

app.use(clerkMiddleware());

// 3. Database Connection Logic
let isConnected = false;
const connectDB = async () => {
    if (isConnected && mongoose.connection.readyState === 1) return;
    try {
        await mongoose.connect(process.env.MONGO_URI || '', {
            maxPoolSize: 1 // Keep connections lean for Workers
        });
        isConnected = true;
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

app.use(async (req, res, next) => {
    await connectDB();
    next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/su', superAdminRoutes);
app.use('/api/admin', adminRoutes);
app.use('/payments', razorpayRoutes);
app.use('/api/student', studentRoutes);

// 4. Wrap Express app in an HTTP server before passing to httpServerHandler
//    httpServerHandler expects an http.Server instance, not a bare Express app
const server = createServer(app);             // ← CHANGED
const handler = httpServerHandler(server);    // ← CHANGED

export default {
    fetch: (req: Request, env: any, ctx: any) => {
        return handler.fetch(req, env, ctx);
    },
    async scheduled(event: any, env: any, ctx: any) {
        console.log("Cron trigger received!");
        // Your cron logic here
    }
};