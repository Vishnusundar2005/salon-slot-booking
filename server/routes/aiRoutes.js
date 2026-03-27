const express = require('express');
const router = express.Router();
const multer = require('multer');
const { analyzeStyle } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// Multer memory storage (we don't need to save the file permanently)
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed'));
    }
  },
});

// @route   POST /api/ai/hairstyle
// @access  Private (Requires login)
router.post('/hairstyle', protect, upload.single('image'), analyzeStyle);

module.exports = router;
