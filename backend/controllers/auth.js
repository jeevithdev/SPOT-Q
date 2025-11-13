const User = require('../models/user');
const { generateToken } = require('../utils/jwt'); 

// Hardcoded list of departments for controller validation
const DEPARTMENTS = [
    'All', 'Melting', 'Sand Lab', 'Moulding', 'Process', 'Micro Tensile', 
    'Tensile', 'QC - production', 'Micro Structure', 'Impact', 'Admin'
];

// ===================================
// 1. PUBLIC AUTHENTICATION ROUTES
// ===================================

exports.login = async (req, res) => {
    try {
        const { employeeId, password } = req.body;
        
        if (!employeeId || !password) {
            return res.status(400).json({ success: false, message: 'ID and password are required.' });
        }
        
        const user = await User.findOne({ employeeId: employeeId.toUpperCase() });
        
        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        
        if (!user.isActive) {
            return res.status(401).json({ success: false, message: 'Account deactivated. Contact administrator.' });
        }
        
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials.' });
        }
        
        const token = generateToken(user._id);

        // Append login timestamp (keep last 50 for size control)
        user.loginHistory = user.loginHistory || [];
        user.loginHistory.push(new Date());
        if (user.loginHistory.length > 50) {
            user.loginHistory = user.loginHistory.slice(-50);
        }
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Login successful.',
            token,
            user: user.toJSON()
        });
    } catch (error) {
        console.error('❌ Login error:', error);
        res.status(500).json({ success: false, message: 'Server error during login.' });
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

// Fetch login history for the authenticated user
exports.getLoginHistory = async (req, res) => {
    try {
        const history = (req.user.loginHistory || []).sort((a, b) => new Date(b) - new Date(a));
        res.status(200).json({ success: true, count: history.length, data: history });
    } catch (error) {
        console.error('❌ Get login history error:', error);
        res.status(500).json({ success: false, message: 'Server error retrieving login history.' });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const userId = req.user._id;
        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            return res.status(400).json({ success: false, message: 'Current password and new password are required.' });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
        }

        const user = await User.findById(userId);

        const isMatch = await user.comparePassword(currentPassword);
        
        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Incorrect current password.' });
        }

        user.password = newPassword; 
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password updated successfully.'
        });

    } catch (error) {
        console.error('❌ Change password error:', error);
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
        console.error('❌ Create employee error:', error);
        res.status(500).json({ success: false, message: 'Server error during employee creation.', error: error.message });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        
        res.status(200).json({
            success: true,
            count: users.length,
            data: users.map(user => user.toJSON()) 
        });
    } catch (error) {
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
        
        // Always filter out "All" from the list (it's used for validation/assignment, not display)
        // Keep it for create/update validation but don't send to frontend lists
        departments = departments.filter(d => d !== 'All');
        
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