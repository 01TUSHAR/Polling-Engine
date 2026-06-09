import { Server } from 'socket.io';

const socketConfig = (server) => {
    const io = new Server(server, {
        cors: {
            origin: process.env.CLIENT_URL || "http://localhost:5173",
        }
    });

    io.on('connection', (socket) => {
        const ipAddress = socket.handshake.address;

        socket.on('join-poll', (pollId) => {
            socket.join(pollId);
            console.log(`User joined poll: ${pollId}`);
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};

export default socketConfig;
