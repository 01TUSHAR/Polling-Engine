import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import connectDB from './config/db.js';
import socketConfig from './config/socket.js';
import pollRoutes from "./routes/poll.routes.js";
import voteRoutes from "./routes/vote.routes.js";

// Initialize Express
const app = express();
const server = http.createServer(app);

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Initialize Socket.io
const io = socketConfig(server);

// Make IO accessible to routes
app.set('io', io);

// Health Check Route
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

app.use("/api/polls", pollRoutes);
app.use("/api/votes", voteRoutes);

// Start Server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`\n Polling Engine Server`);
    console.log(` URL: http://localhost:${PORT}`);
    console.log(` Sockets: Active\n`);
});
