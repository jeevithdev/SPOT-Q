const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
    employeeId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    
    name: { 
        type: String,
        required: true,
        trim: true 
    },

    email: { 
        type: String,
        sparse: true, 
        unique: true,
        lowercase: true, 
        trim: true
    },

    department: {
        type: String,
        enum: ['Melting', 'Sand Lab', 'Moulding', 'Process', 'Micro Tensile', 'Tensile', 'QC - production', 'Micro Structure', 'Impact', 'Admin'],
        required: true
    },

    role: {
        type: String,
        enum: ['admin', 'employee'],
        default: 'employee',
        required: true
    },

    password: { 
        type: String, 
        required: true,
        minlength: 6,
        select: false 
    },

    isActive: {
        type: Boolean,
        default: true
    }
}, 
{ timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
    const userWithPassword = await this.model('User').findById(this._id).select('+password');

    if (!userWithPassword || !userWithPassword.password) return false;
    
    return await bcrypt.compare(candidatePassword, userWithPassword.password);
};

// Exclude password from JSON output
userSchema.methods.toJSON = function() {
    const user = this.toObject();
    delete user.password;
    return user;
};

module.exports = mongoose.model('User', userSchema);