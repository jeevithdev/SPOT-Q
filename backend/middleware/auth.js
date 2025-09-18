const jwt = require('jsonwebtoken');
const User = require('../models/user');

// Resolve JWT secret with a strict production requirement
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

// Middleware to verify JWT Bearer token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!token) {
      return res.status(401).json({ 
        message: 'Access token required',
        error: 'NO_TOKEN'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid token - user not found',
        error: 'INVALID_TOKEN'
      });
    }

    if (user.isActive === false) {
      return res.status(401).json({ 
        message: 'Account is deactivated',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired', error: 'TOKEN_EXPIRED' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token', error: 'INVALID_TOKEN' });
    }
    console.error('Auth middleware error:', error);
    return res.status(500).json({ message: 'Authentication error', error: 'AUTH_ERROR' });
  }
};

// Optional middleware for routes that can work with or without auth
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
    if (!token) {
      req.user = null;
      return next();
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    req.user = user || null;
    next();
  } catch (_err) {
    req.user = null;
    next();
  }
};

// Middleware to check user roles
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        message: 'Authentication required',
        error: 'AUTH_REQUIRED'
      });
    }

    const userRole = req.user.role || 'user';
    const allowedRoles = Array.isArray(roles) ? roles : [roles];

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ 
        message: 'Insufficient permissions',
        error: 'INSUFFICIENT_PERMISSIONS'
      });
    }

    next();
  };
};

// Middleware to check if user is verified
const requireVerified = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      message: 'Authentication required',
      error: 'AUTH_REQUIRED'
    });
  }

  if (!req.user.isVerified) {
    return res.status(403).json({ 
      message: 'Email verification required',
      error: 'EMAIL_NOT_VERIFIED'
    });
  }

  next();
};

module.exports = {
  authenticateToken,
  optionalAuth,
  requireRole,
  requireVerified
};
