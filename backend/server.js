const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const postRoutes = require('./routes/posts');
const chatRoutes = require('./routes/chat');
const storyRoutes = require('./routes/stories');
const uploadRoutes = require('./routes/upload');

const app = express();

// Trust proxy for Vercel deployment
app.set('trust proxy', 1);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again later.',
  trustProxy: false
});

app.use(helmet());
app.use(limiter);
app.use(cors({
  origin: "*",
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection for serverless environment (Vercel-safe)
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    console.log('🔄 Using cached MongoDB connection');
    return cached.conn;
  }

  if (!cached.promise) {
    console.log('🔍 MONGODB_URI check:', process.env.MONGODB_URI ? 'Set' : 'NOT SET');
    console.log('🔍 JWT_SECRET check:', process.env.JWT_SECRET ? 'Set' : 'NOT SET');
    
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://UNEXA:UNEXA@unexa.zaxa9nd.mongodb.net/';
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('🔗 URI:', mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));

    cached.promise = mongoose.connect(mongoUri, {
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      maxPoolSize: 5
    }).then(mongoose => {
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    }).catch(err => {
      console.error('❌ MongoDB connection error:', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    console.error('❌ Failed to connect to MongoDB:', err.message);
    throw err;
  }
}

// Connect to database
connectDB().catch(err => console.error('Initial DB connection failed:', err));

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/', (req, res) => {
  res.json({ status: "UNEXA backend running on Vercel 🚀" });
});

// Handle favicon requests to prevent 404 errors
app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/favicon.png', (req, res) => {
  res.status(204).end();
});

// For Vercel deployment - NO server.listen(), NO socket.io
module.exports = app;
