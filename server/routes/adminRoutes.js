const express = require('express');
const router = express.Router();
const { getAllAdmins, createAdmin, deleteAdmin } = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { superAdminOnly } = require('../middleware/adminMiddleware');

// All routes require authentication + superadmin role
router.use(protect, superAdminOnly);

router.get('/admins', getAllAdmins);
router.post('/admins', createAdmin);
router.delete('/admins/:id', deleteAdmin);

module.exports = router;
