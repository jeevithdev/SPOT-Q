const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const { authenticateToken } = require('../middleware/auth');
// Firebase removed - using MongoDB authentication only

const router = express.Router();

// Resolve JWT secret with a strict production requirement (kept in sync with middleware)
const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET environment variable is required in production');
    }
    return 'dev-insecure-secret';
  }
  return secret;
};

const JWT_SECRET = getJwtSecret();

// Generate JWT Token
const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
// @desc    Register new user (simplified - no OTP)
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'All fields are required',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long',
        errors: { password: 'Password too short' }
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email',
        errors: { email: 'Email already registered' }
      });
    }

    // Create new user (verified immediately - no OTP)
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: (phone || '').trim(),
      isVerified: true, // Auto-verify users
      provider: 'local'
    });

    await user.save();

    console.log(`✅ User registered: ${email} - Account created successfully`);

    res.status(201).json({
      message: 'User registered successfully. Please log in with your credentials.',
      success: true
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = {};
      Object.keys(error.errors).forEach(key => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        message: 'Validation failed',
        errors
      });
    }

    res.status(500).json({ message: 'Server error during registration' });
  }
});

// Firebase phone registration removed - using simple email/password registration only

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required',
        errors: {
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null
        }
      });
    }

    // Find user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid email or password',
        errors: { email: 'Invalid credentials' }
      });
    }

    // Check if account is locked
    if (user.isLocked) {
      return res.status(423).json({ 
        message: 'Account temporarily locked due to too many failed login attempts. Please try again later.'
      });
    }

    // Allow login regardless of email verification status (relax for current requirements)

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      await user.incLoginAttempts();
      return res.status(401).json({ 
        message: 'Invalid email or password',
        errors: { password: 'Invalid credentials' }
      });
    }

    // Reset login attempts and update last login
    if (user.loginAttempts > 0) {
      await user.resetLoginAttempts();
    }
    await user.updateLastLogin();

    // Generate token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});


// @route   GET /api/auth/verify
// @desc    Verify JWT token
// @access  Private
router.get('/verify', authenticateToken, (req, res) => {
  res.json({
    message: 'Token is valid',
    user: req.user.getPublicProfile()
  });
});

// @route   GET /api/auth/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', authenticateToken, (req, res) => {
  res.json({
    user: req.user.getPublicProfile()
  });
});

// Phone verification for forgot password removed

// Firebase OTP verification for forgot password removed

// Firebase login removed - using simple email/password login only

module.exports = router;