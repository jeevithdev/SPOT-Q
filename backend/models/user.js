const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema
const userSchema = new mongoose.Schema({
  name: { 
  type: String,
  required: true,
  trim: true },

  email: { 
    type: String,
    required: true, 
    unique: true, 
    lowercase: true, 
    trim: true, 
    match: [/^[\w.-]+@gmail\.com$/, 'Please enter a valid Gmail address'] },

  phone: { 
    type: String, 
    default: '' },

  password: { 
    type: String, 
    required: true,
    minlength: 6 }
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
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};
// Exclude password from toJSON output
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
