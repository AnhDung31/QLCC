const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose'); // Import mongoose
const config = require('./config/mqtt.config');
const MQTTService = require('./services/mqtt.service');
const SocketController = require('./controllers/socket.controller');
const employeeRoutes = require('./routes/employee.routes'); // Import employee routes
const positionRoutes = require('./routes/position.routes'); // Import position routes
const departmentRoutes = require('./routes/department.routes'); // Import department routes
const checkinRoutes = require('./routes/checkin.routes'); // Import checkin routes
const userRoutes = require('./routes/user.routes'); // Import user routes
const deviceRoutes = require('./routes/device.routes'); // Import device routes
const authRoutes = require('./routes/auth.routes'); // Import auth routes
const cors = require('cors'); // Import cors for handling cross-origin requests

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Middleware to parse JSON requests
app.use(express.json());

// Enable CORS
app.use(cors());

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize services and controllers
const mqttService = new MQTTService(io);
const socketController = new SocketController(io);

// Use routes


// Connect to MQTT broker
mqttService.connect();

// Initialize Socket.IO controller
socketController.initialize();

// Port mà Socket.IO server sẽ lắng nghe
const SOCKET_IO_PORT = process.env.SOCKET_IO_PORT || 3002;

// Start the HTTP server (which Socket.IO is bound to) on port 3002
server.listen(SOCKET_IO_PORT, () => {
  console.log(`Socket.IO server is listening on port ${SOCKET_IO_PORT}`);
});
require("./server");
// Export the Socket.IO instance if needed in other modules (like mqtt.service.js)
module.exports = { app, server, io }; 