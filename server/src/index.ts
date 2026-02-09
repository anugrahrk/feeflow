import express from 'express';
import http from 'http';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { initSocket } from './services/socketService.js';
import { initScheduler } from './services/schedulerService.js';

// Routes
import superAdminRoutes from './routes/superAdminRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import adminStatsRoutes from './routes/adminStatsRoutes.js';
import razorpayRoutes from './routes/razorpayRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());
app.use(express.json());

// Debug Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Initialize Socket.io
initSocket(server);

// Initialize Scheduler
initScheduler();

// Database Connection
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        // Start Server only after DB connection
        server.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('MongoDB connection error:', err);
    });

// Graceful Shutdown
const shutdown = () => {
    console.log('Received kill signal, shutting down gracefully');
    server.close(() => {
        console.log('Closed out remaining connections');
        process.exit(0);
    });

    setTimeout(() => {
        console.error('Could not close connections in time, forcefully shutting down');
        process.exit(1);
    }, 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// Routes
app.use('/api/su', superAdminRoutes); // Super Admin: /api/su/organizations
app.use('/api/admin', adminRoutes);   // Admin: /api/admin/students
app.use('/api/admin', adminStatsRoutes); // Admin Stats: /api/admin/stats
app.use('/api/payments', razorpayRoutes); // Public/Student: /api/payments/create-order

// Basic Route
app.get('/', (req, res) => {
    res.send('Fee Payment System API is running...');
});

// Error Handling Middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
