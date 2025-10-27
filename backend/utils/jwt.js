const jwt = require('jsonwebtoken');

exports.generateToken = (userId) => {
    // NOTE: Ensure JWT_SECRET and JWT_EXPIRE are in your .env file
    return jwt.sign(
        { id: userId }, 
        process.env.JWT_SECRET || 'your_fallback_secret_key', 
        { expiresIn: process.env.JWT_EXPIRE || '30d' }
    );
};