const express = require('express');
const router = express.Router();
const {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
  getTodayBookings,
  getAllBookings,
} = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

// Public — slot availability
router.get('/slots', getAvailableSlots);

// Customer
router.post('/', protect, createBooking);
router.get('/my', protect, getMyBookings);
router.put('/:id/cancel', protect, cancelBooking);

// Admin
router.get('/today', protect, adminOnly, getTodayBookings);
router.get('/', protect, adminOnly, getAllBookings);

module.exports = router;
