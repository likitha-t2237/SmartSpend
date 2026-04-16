require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
require('./config/redis'); // Just to test connection
const socketHandlers = require('./sockets/socketHandlers');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: { origin: '*', methods: ['GET', 'POST'] }
});

// Middleware
app.use(cors());
app.use(express.json());

// Initialize MongoDB
connectDB();

// Initialize Sockets
socketHandlers.initSockets(io);

// Routes
app.use('/api/transactions', require('./routes/transactions'));
// Other route placeholders
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Backend Server running on port ${PORT}`);
});
