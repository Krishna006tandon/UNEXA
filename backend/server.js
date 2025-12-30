const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { createServer } = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const chatRoutes = require('./routes/chat');
const storyRoutes = require('./routes/stories');
const uploadRoutes = require('./routes/upload');

const app = express();
const server = createServer(app);

// Trust proxy for Vercel deployment
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  trustProxy: false
});

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection for serverless environment
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  
  // Debug: Check if MONGODB_URI is set
  console.log('🔍 MONGODB_URI check:', process.env.MONGODB_URI ? 'Set' : 'NOT SET');
  console.log('🔍 JWT_SECRET check:', process.env.JWT_SECRET ? 'Set' : 'NOT SET');
  
  const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://UNEXA:UNEXA@unexa.zaxa9nd.mongodb.net/';
  
  try {
    await mongoose.connect(mongoUri, {
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false
    });
    isConnected = true;
    console.log('✅ MongoDB connected successfully');
    console.log('📊 Database ready for operations');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    isConnected = false;
  }
};

// Connect to database
connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'UNEXA Backend Server is running!' });
});

// Handle favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/favicon.png', (req, res) => {
  res.status(204).end();
});

const activeUsers = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    io.to(data.roomId).emit('receive_message', data);
  });

  socket.on('typing', (data) => {
    socket.to(data.roomId).emit('user_typing', data);
  });

  socket.on('stop_typing', (data) => {
    socket.to(data.roomId).emit('user_stop_typing', data);
  });

  socket.on('user_online', (userId) => {
    activeUsers.set(userId, socket.id);
    io.emit('online_users', Array.from(activeUsers.keys()));
  });

  socket.on('disconnect', () => {
    const userId = [...activeUsers.entries()].find(([_, id]) => id === socket.id)?.[0];
    if (userId) {
      activeUsers.delete(userId);
      io.emit('online_users', Array.from(activeUsers.keys()));
    }
    console.log('User disconnected:', socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// For Vercel deployment
module.exports = app;
