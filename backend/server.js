const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const session = require('express-session');
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

// Import models and middleware
const User = require('./models/user');
const { authenticateToken } = require('./middleware/auth');
const { connectDB } = require('./config/database');
const authRoutes = require('./routes/auth');
// Firebase removed - using MongoDB only

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Disable CSP for development
  crossOriginEmbedderPolicy: false
}));

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.',
    retryAfter: '15 minutes'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// CORS Configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000', // React app URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-session-secret',
  resave: true, // Changed to true to ensure session is saved
  saveUninitialized: true, // Changed to true to save new sessions
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 15 * 60 * 1000, // 15 minutes
    httpOnly: true, // Prevent XSS attacks
    sameSite: 'lax' // CSRF protection
  },
  name: 'spotq.session' // Custom session name
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
connectDB();


// Firebase removed - using MongoDB authentication only
console.log('Authentication: MongoDB-based (Firebase removed)');

// JWT removed from server-level configuration (handled elsewhere or disabled)


// Routes
app.use('/api/auth', authRoutes);

// Development diagnostics route (non-sensitive)
if ((process.env.NODE_ENV || 'development') !== 'production') {
  app.get('/api/__debug__/env', (req, res) => {
    res.json({
      frontendUrl: process.env.FRONTEND_URL,
      corsOriginConfigured: process.env.FRONTEND_URL || 'http://localhost:3000',
      nodeEnv: process.env.NODE_ENV || 'development',
      authType: 'MongoDB-based (Firebase removed)'
    });
  });
}

// Database connection event listeners are handled in config/database.js

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({ message: 'Internal server error' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
