const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./db'); // Import the database connection function
const projectRoutes = require('./routes/createProject'); // Import routes for projects

const app = express();
// const bodyParser = require('body-parser');
require('dotenv').config();


const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "http://localhost:3000", // The origin of your React app
        methods: ["GET", "POST"],
        credentials: true
    }
});

// Connect to MongoDB
connectDB(); // Call the function to connect to the database

// Middleware for parsing JSON
app.use(express.json());

// Use project routes
// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api', projectRoutes);

// Socket.IO setup
io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    // Join a project room
    socket.on('join_room', ({ roomId }) => {
        socket.join(roomId);
        console.log(`User ${socket.id} joined room: ${roomId}`);
    });

    // Handle code changes
    socket.on('code_change', ({ roomId, code }) => {
        // Emit the code update to everyone in the room, except the sender
        socket.to(roomId).emit('code_update', code);
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});


// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
