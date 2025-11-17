const User = require('../models/user');
const LoginActivity = require('../models/LoginActivity');
const { generateToken } = require('../utils/jwt');
const bcrypt = require('bcryptjs'); 

// Hardcoded list of departments for controller validation
const DEPARTMENTS = [
    'Melting', 'Sand Lab', 'Moulding', 'Process', 'Micro Tensile',
    'Tensile', 'QC - production', 'Micro Structure', 'Impact', 'Admin'
];

// 1. PUBLIC AUTHENTICATION ROUTES


exports.login = async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        
        if (!employeeId || !password) {
            return res.status(400).json({ success: false, message: 'ID and password are required.' });
        }
        
        // Fetch user with password field selected
        const user = await User.findOne({ employeeId: employeeId.toUpperCase() }).select('+password');
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        
        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account deactivated. Contact administrator.' });
        }
        
        // Compare password directly using bcrypt
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }

        const token = generateToken(user._id);

        // Store login activity
        try {
            await LoginActivity.create({
                userId: user._id,
                employeeId: user.employeeId,
                department: user.department,
                ip: req.ip || req.connection.remoteAddress || req.headers['x-forwarded-for'],
                userAgent: req.headers['user-agent'] || 'Unknown'
            });
        } catch (loginActivityError) {
            // Log the error but don't fail the login
            console.error('Error storing login activity:', loginActivityError);
        }

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: user.toJSON()
        }); 
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login.', error: error.message });
    }
};

exports.verify = async (req, res) => {
    try {
        res.status(200).json({
            success: true,
            user: req.user.toJSON()
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during verification.' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ success: false, message: 'New password is required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully.'
        });

    } catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ success: false, message: 'Server error during password change.' });
    }
};


// ===================================
// 2. ADMIN ONLY USER MANAGEMENT ROUTES
// ===================================

exports.createEmployee = async (req, res) => {
    try {
        // REMOVED 'email' from destructuring
        const { employeeId, name, password, department } = req.body;
        
        if (!employeeId || !name || !password || !department) {
            return res.status(400).json({ success: false, message: 'Employee ID, name, password, and department are required.' });
        }
        
        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        }
        
        if (!DEPARTMENTS.includes(department)) {
            return res.status(400).json({ success: false, message: 'Invalid department.' });
        }
        
        const existingUser = await User.findOne({ employeeId: employeeId.toUpperCase() });
        
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Employee ID already exists.' });
        }
        
        const user = new User({ 
            employeeId: employeeId.toUpperCase(),
            name, password, department,
            role: 'employee'
        });
        
        await user.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Employee created successfully.',
            data: user.toJSON() 
        });
    } catch (error) {
        console.error(' Create employee error:', error);
        res.status(500).json({ success: false, message: 'Server error during employee creation.', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });

        // Get last login for each user
        const usersWithLastLogin = await Promise.all(users.map(async (user) => {
            const lastLogin = await LoginActivity.findOne({ userId: user._id })
                .sort({ loginAt: -1 })
                .limit(1);

            const userObj = user.toJSON();
            userObj.lastLogin = lastLogin ? lastLogin.loginAt : null;
            return userObj;
        }));

        res.status(200).json({
            success: true,
            count: usersWithLastLogin.length,
            data: usersWithLastLogin
        });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching users.' });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        // REMOVED 'email' from destructuring
        const { name, department, password, isActive } = req.body;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        
        if (user._id.toString() === req.user._id.toString() && isActive === false) {
            return res.status(400).json({ success: false, message: 'Cannot deactivate your own account' });
        }
        
        if (name) user.name = name;
        if (department && DEPARTMENTS.includes(department)) user.department = department;
        // email update logic removed
        if (password && password.length >= 6) user.password = password; 
        if (typeof isActive === 'boolean') user.isActive = isActive;
        
        await user.save();
        
        res.status(200).json({ 
            success: true,
            message: 'Employee updated successfully',
            data: user.toJSON()
        }); 
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during employee update.', error: error.message });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        
        const user = await User.findById(id);
        
        if (!user) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        
        if (user._id.toString() === req.user._id.toString() || user.role === 'admin') {
            return res.status(400).json({ success: false, message: 'Cannot delete admin accounts or your own account' });
        }
        
        await User.findByIdAndDelete(id);
        
        res.status(200).json({ success: true, message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error during employee deletion.', error: error.message });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        // Option to exclude Admin department via query parameter
        const { excludeAdmin } = req.query;

        let departments = DEPARTMENTS;

        // Filter out Admin department if requested
        if (excludeAdmin === 'true') {
            departments = departments.filter(d => d !== 'Admin');
        }

        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error while fetching departments.' });
    }
};

// Get login history for the current user's department (last 5 logins)
exports.getDepartmentLoginHistory = async (req, res) => {
    try {
        const department = req.user.department;

        const loginHistory = await LoginActivity.find({ department })
            .sort({ loginAt: -1 })
            .limit(5)
            .select('employeeId loginAt ip userAgent');

        res.status(200).json({
            success: true,
            data: loginHistory
        });
    } catch (error) {
        console.error('Error fetching department login history:', error);
        res.status(500).json({ success: false, message: 'Server error while fetching login history.' });
    }
};

// Admin-only: Reset user password without requiring old password
exports.adminResetPassword = async (req, res) => {
    try {
        const { userId, newPassword } = req.body;

        if (!userId || !newPassword) {
            return res.status(400).json({ success: false, message: 'User ID and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' });
        }

        user.password = newPassword;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successfully.'
        });
    } catch (error) {
        console.error('Admin reset password error:', error);
        res.status(500).json({ success: false, message: 'Server error during password reset.' });
    }
};