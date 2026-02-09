import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';

let io: Server;

export const initSocket = (httpServer: HttpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: '*', // Allow all origins for now, restrict in production
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket: Socket) => {
        console.log('New client connected:', socket.id);

        socket.on('join_org', (orgId: string) => {
            console.log(`Socket ${socket.id} joined org room: ${orgId}`);
            socket.join(orgId);
        });

        socket.on('disconnect', () => {
            console.log('Client disconnected:', socket.id);
        });
    });

    return io;
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized!');
    }
    return io;
};

export const notifyPayment = (orgId: string, data: { studentName: string; amount: number }) => {
    if (io) {
        io.to(orgId).emit('payment_received', data);
    }
};
