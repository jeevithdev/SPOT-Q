const jwt = require('jsonwebtoken');
const User = require('../models/user');

/**
 * Authentication middleware - verifies JWT token and loads user
 * This middleware only handles authentication, not authorization
 */
exports.protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } 

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized, access token missing.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_fallback_secret_key');

        req.user = await User.findById(decoded.id);

        if (!req.user || !req.user.isActive) {
            return res.status(401).json({ success: false, message: 'User invalid or deactivated.' });
        }
        
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized, token failed.' });
    }
};