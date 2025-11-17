const bcrypt = require('bcryptjs');

const hashPassword = async (plain) => {
    const salt = await bcrypt.genSalt(12);
    return bcrypt.hash(plain, salt);
};

const comparePassword = async (plain, hashed) => {
    return bcrypt.compare(plain, hashed);
};

const excludePasswordFromJSON = function() {
    const obj = this.toObject();
    delete obj.password;
    return obj;
};

// Pre-save hook to hash password
const hashPasswordPreSave = async function(next) {
    if (!this.isModified('password') || !this.password) return next();
    try {
        this.password = await hashPassword(this.password);
        next();
    } catch (error) {
        next(error);
    }
};

// Method to compare password
const comparePasswordMethod = async function(candidatePassword) {
    const userWithPassword = await this.model('User').findById(this._id).select('+password');

    if (!userWithPassword || !userWithPassword.password) return false;

    return await comparePassword(candidatePassword, userWithPassword.password);
};

// Apply all password utilities to a schema
exports.applyPasswordUtilities = (schema) => {
    schema.pre('save', hashPasswordPreSave);
    schema.methods.comparePassword = comparePasswordMethod;
    schema.methods.toJSON = excludePasswordFromJSON;
};

exports.hashPassword = hashPassword;
exports.comparePassword = comparePassword;
