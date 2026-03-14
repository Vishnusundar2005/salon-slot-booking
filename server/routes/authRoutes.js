const express = require('express');
const router = express.Router();
const { register, login, adminLogin, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Customer routes
router.post('/register', register);
router.post('/login', login);

// Admin-only login (separate portal)
router.post('/admin/login', adminLogin);

// Shared — get logged-in user profile
router.get('/me', protect, getMe);

module.exports = router;
