const User = require('../models/User');

// @desc    Get all admins (excluding superadmin)
// @route   GET /api/admin/admins
// @access  Super Admin only
const getAllAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'admin' }).select('-password');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new admin account
// @route   POST /api/admin/admins
// @access  Super Admin only
const createAdmin = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const normalizedPhone = phone.startsWith('+')
      ? phone
      : phone.length === 10
      ? `+91${phone}`
      : `+${phone}`;

    const admin = await User.create({
      name,
      email,
      password,
      phone: normalizedPhone,
      role: 'admin',
    });

    res.status(201).json({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      phone: admin.phone,
      role: admin.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an admin account
// @route   DELETE /api/admin/admins/:id
// @access  Super Admin only
const deleteAdmin = async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }

    // Prevent deleting superadmin accounts
    if (admin.role === 'superadmin') {
      return res.status(403).json({ message: 'Cannot delete a Super Admin account' });
    }

    if (admin.role !== 'admin') {
      return res.status(400).json({ message: 'Target user is not an admin' });
    }

    await admin.deleteOne();
    res.json({ message: 'Admin deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllAdmins, createAdmin, deleteAdmin };
