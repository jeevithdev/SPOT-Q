const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/user');
const { authenticateToken } = require('../middleware/auth');
const { verifyFirebaseIdToken } = require('../config/firebaseAdmin');
const { sendOtpEmail, sendPasswordResetEmail } = require('../utils/emailService');

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
// @desc    Register new user
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

    // Create new user (unverified initially)
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone: (phone || '').trim(),
      isVerified: false
    });

    // Generate OTP for email verification (10 mins)
    const otp = user.generateOtp();

    await user.save();

    // Send OTP via email
    const emailResult = await sendOtpEmail(email, name, otp);
    
    if (emailResult.success) {
      console.log(`✅ User registered: ${email} - OTP email sent successfully`);
    } else {
      console.log(`⚠️ User registered: ${email} - OTP email failed: ${emailResult.error}`);
      console.log(`📧 OTP for ${email}: ${otp} (fallback - check console)`);
    }

    res.status(201).json({
      message: 'User created. Please check your email for OTP verification.',
      requiresOtp: true,
      user: { id: user._id, email: user.email },
      emailSent: emailResult.success
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

// @route   POST /api/auth/register-with-phone
// @desc    Register new user after verifying phone via Firebase ID token
// @access  Public
router.post('/register-with-phone', async (req, res) => {
  try {
    const { name, email, password, idToken } = req.body;

    if (!name || !email || !password || !idToken) {
      return res.status(400).json({
        message: 'Name, email, password and idToken are required',
        errors: {
          name: !name ? 'Name is required' : null,
          email: !email ? 'Email is required' : null,
          password: !password ? 'Password is required' : null,
          idToken: !idToken ? 'idToken is required' : null
        }
      });
    }

    if (password.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long',
        errors: { password: 'Password too short' }
      });
    }

    let decoded;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (e) {
      if (e && e.code === 'FIREBASE_ADMIN_NOT_CONFIGURED') {
        return res.status(501).json({ message: 'Firebase Admin not configured on server' });
      }
      console.error('Firebase token verify error:', e);
      return res.status(401).json({ message: 'Invalid Firebase ID token' });
    }

    const phone = decoded.phone_number || '';
    // Phone may be absent for Google OAuth; proceed using email/uid

    // Ensure user does not already exist by email
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User already exists with this email',
        errors: { email: 'Email already registered' }
      });
    }

    // Create verified user with phone
    const user = new User({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      phone,
      isVerified: true,
      provider: 'local'
    });

    await user.save();

    const token = generateToken(user._id);

    return res.status(201).json({
      message: 'Registration successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Register with phone error:', error);
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
    return res.status(500).json({ message: 'Server error during phone registration' });
  }
});

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

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP for newly registered user and issue JWT
// @access  Public
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: 'Email and OTP are required',
        errors: {
          email: !email ? 'Email is required' : null,
          otp: !otp ? 'OTP is required' : null
        }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (!user.otpCode || !user.otpExpires || user.otpExpires < Date.now()) {
      return res.status(400).json({ message: 'OTP expired. Please register again.' });
    }

    if (String(user.otpCode) !== String(otp)) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    // Mark verified and clear OTP fields
    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(user._id);

    return res.json({
      message: 'Account verified successfully',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Verify OTP error:', error);
    return res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

// Google login removed

// @route   POST /api/auth/forgot-password
// @desc    Send password reset email
// @access  Public
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        message: 'Email is required',
        errors: { email: 'Email is required' }
      });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({ 
        message: 'No account found with this email address.',
        error: 'USER_NOT_FOUND'
      });
    }

    if (user.provider !== 'local') {
      return res.status(400).json({ 
        message: `Cannot reset password for ${user.provider} accounts. Please login with ${user.provider}.`
      });
    }

    // Generate reset token
    user.generatePasswordResetToken();
    await user.save();

    // Send password reset email
    const emailResult = await sendPasswordResetEmail(email, user.name, user.resetPasswordToken);
    
    if (emailResult.success) {
      console.log(`✅ Password reset email sent to: ${email}`);
    } else {
      console.log(`⚠️ Password reset email failed for: ${email} - ${emailResult.error}`);
      console.log(`🔑 Reset token for ${email}: ${user.resetPasswordToken} (fallback - check console)`);
    }

    res.json({ 
      message: 'If an account with that email exists, a password reset email has been sent.',
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// @route   POST /api/auth/forgot-password-phone
// @desc    Verify phone via Firebase ID token, then send password reset email
// @access  Public
router.post('/forgot-password-phone', async (req, res) => {
  try {
    const { email, idToken } = req.body;

    if (!email || !idToken) {
      return res.status(400).json({
        message: 'Email and idToken are required',
        errors: {
          email: !email ? 'Email is required' : null,
          idToken: !idToken ? 'idToken is required' : null
        }
      });
    }

    let decoded;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (e) {
      if (e && e.code === 'FIREBASE_ADMIN_NOT_CONFIGURED') {
        return res.status(501).json({ message: 'Firebase Admin not configured on server' });
      }
      console.error('Firebase token verify error:', e);
      return res.status(401).json({ message: 'Invalid Firebase ID token' });
    }

    const phone = decoded.phone_number || '';
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      // Don’t reveal existence; mimic success
      return res.json({ 
        message: 'If an account with that email exists, a password reset email has been sent.'
      });
    }

    if (!phone) {
      return res.status(400).json({ message: 'Phone number not present in Firebase token' });
    }

    if (!user.phone) {
      return res.status(400).json({ message: 'No phone number on file for this account' });
    }

    if (String(user.phone) !== String(phone)) {
      return res.status(403).json({ message: 'Phone number does not match this account' });
    }

    if (user.provider !== 'local') {
      return res.status(400).json({ 
        message: `Cannot reset password for ${user.provider} accounts. Please login with ${user.provider}.`
      });
    }

    // Generate reset token and email
    user.generatePasswordResetToken();
    await user.save();

    const emailResult = await sendPasswordResetEmail(email, user.name, user.resetPasswordToken);
    if (emailResult.success) {
      console.log(`✅ Password reset email sent (phone-verified) to: ${email}`);
    } else {
      console.log(`⚠️ Password reset email failed for: ${email} - ${emailResult.error}`);
      console.log(`🔑 Reset token for ${email}: ${user.resetPasswordToken} (fallback - check console)`);
    }

    return res.json({
      message: 'If an account with that email exists, a password reset email has been sent.',
      emailSent: emailResult.success
    });
  } catch (error) {
    console.error('Forgot password (phone) error:', error);
    return res.status(500).json({ message: 'Server error during password reset request' });
  }
});

// @route   POST /api/auth/reset-password-sms
// @desc    Reset password after SMS verification (using session)
// @access  Public
router.post('/reset-password-sms', async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({ 
        message: 'Email and new password are required',
        errors: {
          email: !email ? 'Email is required' : null,
          newPassword: !newPassword ? 'New password is required' : null
        }
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long',
        errors: { newPassword: 'Password too short' }
      });
    }

    // Debug session data
    console.log('🔍 Reset password request for:', email);
    console.log('📝 Session data:', {
      sessionExists: !!req.session,
      forgotVerified: req.session?.forgotVerified,
      forgotUserId: req.session?.forgotUserId,
      forgotEmail: req.session?.forgotEmail
    });

    // Check if user is verified through session
    if (!req.session || !req.session.forgotVerified || !req.session.forgotUserId) {
      console.log('❌ Session verification failed');
      return res.status(403).json({ 
        message: 'OTP verification required. Please complete the verification process.',
        error: 'VERIFICATION_REQUIRED'
      });
    }

    // Verify email matches session
    if (req.session.forgotEmail !== email.toLowerCase().trim()) {
      return res.status(403).json({ 
        message: 'Email does not match verification session',
        error: 'EMAIL_MISMATCH'
      });
    }

    // Find user by ID from session
    const user = await User.findById(req.session.forgotUserId);
    if (!user) {
      return res.status(404).json({ 
        message: 'User not found',
        error: 'USER_NOT_FOUND'
      });
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    
    await user.save();

    // Clear session
    req.session.forgotVerified = undefined;
    req.session.forgotUserId = undefined;
    req.session.forgotEmail = undefined;

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password (SMS) error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
});

// @route   POST /api/auth/reset-password
// @desc    Reset password with token
// @access  Public
router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({ 
        message: 'Token and new password are required',
        errors: {
          token: !token ? 'Reset token is required' : null,
          newPassword: !newPassword ? 'New password is required' : null
        }
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ 
        message: 'Password must be at least 6 characters long',
        errors: { newPassword: 'Password too short' }
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ 
        message: 'Invalid or expired reset token',
        errors: { token: 'Invalid or expired token' }
      });
    }

    // Update password and clear reset token
    user.password = newPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    // Reset login attempts if any
    user.loginAttempts = 0;
    user.lockUntil = undefined;
    
    await user.save();

    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
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

// @route   POST /api/auth/verify-forgot-data
// @desc    Verify email and phone exist in database for forgot password
// @access  Public
router.post('/verify-forgot-data', async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email || !phone) {
      return res.status(400).json({
        message: 'Email and phone number are required',
        errors: {
          email: !email ? 'Email is required' : null,
          phone: !phone ? 'Phone number is required' : null
        }
      });
    }

    // Find user by email and phone
    const user = await User.findOne({ 
      email: email.toLowerCase().trim(),
      phone: phone.trim()
    });

    if (!user) {
      return res.status(404).json({
        message: 'No account found with this email and phone number combination',
        error: 'USER_NOT_FOUND'
      });
    }

    if (user.provider !== 'local') {
      return res.status(400).json({
        message: `Cannot reset password for ${user.provider} accounts. Please login with ${user.provider}.`
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: 'Account is deactivated. Please contact support.',
        error: 'ACCOUNT_DEACTIVATED'
      });
    }

    // Store user ID in session for OTP verification step
    req.session = req.session || {};
    req.session.forgotUserId = user._id.toString();

    res.json({
      message: 'Email and phone verified successfully',
      user: { id: user._id, email: user.email, phone: user.phone }
    });
  } catch (error) {
    console.error('Verify forgot data error:', error);
    res.status(500).json({ message: 'Server error during verification' });
  }
});

// @route   POST /api/auth/verify-forgot-otp
// @desc    Verify Firebase OTP and prepare for password reset
// @access  Public
router.post('/verify-forgot-otp', async (req, res) => {
  try {
    const { email, idToken } = req.body;

    if (!email || !idToken) {
      return res.status(400).json({
        message: 'Email and idToken are required',
        errors: {
          email: !email ? 'Email is required' : null,
          idToken: !idToken ? 'idToken is required' : null
        }
      });
    }

    // Verify Firebase token
    let decoded;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (e) {
      if (e && e.code === 'FIREBASE_ADMIN_NOT_CONFIGURED') {
        return res.status(501).json({ message: 'Firebase Admin not configured on server' });
      }
      console.error('Firebase token verify error:', e);
      return res.status(401).json({ message: 'Invalid Firebase ID token' });
    }

    const phone = decoded.phone_number || '';
    if (!phone) {
      return res.status(400).json({ message: 'Phone number not present in Firebase token' });
    }

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(404).json({
        message: 'No account found with this email address',
        error: 'USER_NOT_FOUND'
      });
    }

    // Verify phone matches user's phone
    if (user.phone && String(user.phone) !== String(phone)) {
      return res.status(403).json({ message: 'Phone number does not match this account' });
    }

    // Store verification in session for password reset
    req.session = req.session || {};
    req.session.forgotVerified = true;
    req.session.forgotUserId = user._id.toString();
    req.session.forgotEmail = email.toLowerCase().trim();

    console.log('✅ OTP verification successful for:', email);
    console.log('📝 Session data stored:', {
      forgotVerified: req.session.forgotVerified,
      forgotUserId: req.session.forgotUserId,
      forgotEmail: req.session.forgotEmail
    });

    res.json({
      message: 'OTP verified successfully. You can now reset your password.',
      verified: true
    });
  } catch (error) {
    console.error('Verify forgot OTP error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
});

module.exports = router;

// @route   POST /api/auth/firebase-login
// @desc    Exchange Firebase ID token (phone auth) for app JWT, upsert user by phone
// @access  Public
router.post('/firebase-login', async (req, res) => {
  try {
    const { idToken } = req.body;
    if (!idToken) {
      return res.status(400).json({ message: 'idToken is required' });
    }

    let decoded;
    try {
      decoded = await verifyFirebaseIdToken(idToken);
    } catch (e) {
      if (e && e.code === 'FIREBASE_ADMIN_NOT_CONFIGURED') {
        return res.status(501).json({ message: 'Firebase Admin not configured on server' });
      }
      console.error('Firebase token verify error:', e);
      return res.status(401).json({ message: 'Invalid Firebase ID token' });
    }

    const phone = decoded.phone_number || '';
    const uid = decoded.uid;
    const name = decoded.name || '';
    const email = decoded.email || '';

    if (!phone) {
      return res.status(400).json({ message: 'Phone number not present in Firebase token' });
    }

    // Only allow login for existing users - do not create new users
    let user = null;
    if (phone) {
      user = await User.findOne({ phone });
    }
    if (!user && email) {
      user = await User.findOne({ email: email.toLowerCase() });
    }

    if (!user) {
      return res.status(404).json({ 
        message: 'No account found with this phone number. Please register first.',
        error: 'USER_NOT_FOUND'
      });
    }

    // Update user info if needed (but don't change provider for existing users)
    if (email && !user.email) user.email = email.toLowerCase();
    if (phone && !user.phone) user.phone = phone;
    if (!user.isVerified) user.isVerified = true;
    await user.save();

    const token = generateToken(user._id);
    return res.json({
      message: 'Login successful',
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Firebase login error:', error);
    return res.status(500).json({ message: 'Server error during Firebase login' });
  }
});