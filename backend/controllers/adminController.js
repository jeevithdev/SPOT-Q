const User = require('../models/User');
const LoginActivity = require('../models/LoginActivity');
const { hashPassword } = require('../utils/password');
const { cleanUser } = require('../utils/userFormatter');

exports.getDepartments = async (req, res) => {
    try {
        // Return only valid department enum values
        const departments = [
            'Melting',
            'Sand Lab',
            'Moulding',
            'Process',
            'Micro Tensile',
            'Tensile',
            'QC - production',
            'Micro Structure',
            'Impact'
        ];

        res.status(200).json({
            success: true,
            data: departments
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.createEmployee = async (req, res) => {
    try {
        const { employeeId, name, department, password } = req.body;

        if (!employeeId || !name || !department || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
        }

        const exists = await User.findOne({ employeeId: employeeId.toUpperCase() });
        if (exists) {
            return res.status(400).json({ success: false, message: 'Employee ID already exists' });
        }

        const hashed = await hashPassword(password);

        const user = new User({
            employeeId: employeeId.toUpperCase(),
            name,
            department,
            password: hashed,
            role: "employee"
        });

        await user.save();

        return res.status(201).json({
            success: true,
            message: "Employee created",
            data: cleanUser(user)
        });
    } catch (err) {
        console.error('Error creating employee:', err);
        if (err.name === 'ValidationError') {
            return res.status(400).json({ success: false, message: err.message });
        }
        return res.status(500).json({ success: false, message: err.message || "Server error" });
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();

        // Get last login for each user
        const usersWithLastLogin = await Promise.all(users.map(async (user) => {
            const lastLogin = await LoginActivity.findOne({ userId: user._id })
                .sort({ loginAt: -1 })
                .limit(1);

            const userObj = cleanUser(user);
            userObj.lastLogin = lastLogin ? lastLogin.loginAt : null;
            return userObj;
        }));

        res.status(200).json({
            success: true,
            count: usersWithLastLogin.length,
            data: usersWithLastLogin
        });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { name, department, password, isActive } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        if (name) user.name = name;
        if (department) user.department = department;
        if (typeof isActive === 'boolean') user.isActive = isActive;
        if (password) user.password = await hashPassword(password);

        await user.save();

        res.status(200).json({ success: true, message: "Updated", data: cleanUser(user) });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: "Not found" });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ success: false, message: "Cannot delete admin" });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Employee deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
