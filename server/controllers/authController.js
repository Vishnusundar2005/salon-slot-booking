const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Helper to build the response payload
const buildUserPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  token: generateToken(user._id),
});

// @desc    Register a new CUSTOMER account
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Normalize phone number (minimal E.164 compatible)
    const normalizedPhone = phone.startsWith('+') ? phone : (phone.length === 10 ? `+91${phone}` : `+${phone}`);
    
    // Role is always 'customer' from public registration — admins are created via seed/separately
    const user = await User.create({ name, email, password, phone: normalizedPhone, role: 'customer' });

    res.status(201).json(buildUserPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login for CUSTOMERS only
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Block admins from using the customer login portal
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admins must use the admin login portal' });
    }

    res.json(buildUserPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Login for ADMINS only
// @route   POST /api/auth/admin/login
// @access  Public
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Block customers from using the admin login portal
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied: Admin accounts only' });
    }

    res.json(buildUserPayload(user));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current logged-in user profile
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json(req.user);
};

module.exports = { register, login, adminLogin, getMe };
