const express = require('express');
const router = express.Router();
const { getDailyReport, getRangeReport, getPopularServicesReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/daily', protect, adminOnly, getDailyReport);
router.get('/range', protect, adminOnly, getRangeReport);
router.get('/popular-services', protect, adminOnly, getPopularServicesReport);

module.exports = router;
