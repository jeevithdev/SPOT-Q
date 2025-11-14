const User = require('../models/User');
const LoginActivity = require('../models/LoginActivity');
const { hashPassword, comparePassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');
const { cleanUser } = require('../utils/userFormatter');

exports.login = async (req, res) => {
    try {
        const { employeeId, password } = req.body;

        if (!employeeId || !password) {
            return res.status(400).json({ success: false, message: 'Employee ID & Password required' });
        }

        const user = await User.findOne({ employeeId: employeeId.toUpperCase() }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Log login
        await LoginActivity.create({
            userId: user._id,
            ip: req.ip,
            userAgent: req.headers['user-agent']
        });

        const token = generateToken(user._id);

        return res.status(200).json({
            success: true,
            token,
            department: user.department,
            user: cleanUser(user)
        });

    } catch (err) {
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.verify = async (req, res) => {
    return res.status(200).json({ success: true, user: cleanUser(req.user) });
};

exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id).select('+password');

        const match = await comparePassword(currentPassword, user.password);
        if (!match) {
            return res.status(401).json({ success: false, message: 'Wrong current password' });
        }

        user.password = await hashPassword(newPassword);
        await user.save();

        res.status(200).json({ success: true, message: 'Password updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
