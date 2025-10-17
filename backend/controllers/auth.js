const User = require('../models/user');
const { generateToken } = require('../utils/jwt'); 
const validateEmail = require('../utils/validateEmail'); 

// Register Controller
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    console.log(' Registration attempt:', { name, email, phone });
    
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters.' });
    }
 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log(' User already exists:', email);
      return res.status(400).json({ message: 'User already exists.' });
    }
    
    const user = new User({ name, email, password, phone });
    await user.save();
    
    console.log('User registered successfully:', email);
    res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    console.error(' Registration error:', error);
    res.status(500).json({ 
      message: 'Server error during registration.',
      error: error.message 
    });
  }
};

// Login Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log(' Login attempt:', email);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }
    
    const user = await User.findOne({ email });
    if (!user) {
      console.log(' User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
// Validate password   
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log(' Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid credentials.' });
    }
// Generate JWT Token   
    const token = generateToken(user._id);
    
    console.log(' Login successful:', email);
    res.status(200).json({ 
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone
      }
    }); 
  } catch (error) {
    console.error(' login error:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
