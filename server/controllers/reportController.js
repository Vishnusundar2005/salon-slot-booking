const { getRevenueByDateRange, getPopularServices } = require('../services/revenueService');
const Booking = require('../models/Booking');

// @desc    Get daily revenue report
// @route   GET /api/reports/daily?date=YYYY-MM-DD
// @access  Private/Admin
const getDailyReport = async (req, res) => {
  try {
    const date = req.query.date || new Date().toISOString().split('T')[0];
    const report = await getRevenueByDateRange(date, date);

    const bookings = await Booking.find({ date }).countDocuments();

    res.json({
      date,
      totalBookings: bookings,
      ...report,
      payments: undefined, // Strip raw payment list for summary view
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get revenue report for a date range
// @route   GET /api/reports/range?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
// @access  Private/Admin
const getRangeReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    if (!startDate || !endDate) {
      return res.status(400).json({ message: 'startDate and endDate are required' });
    }

    const report = await getRevenueByDateRange(startDate, endDate);
    res.json({ startDate, endDate, ...report });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get popular services
// @route   GET /api/reports/popular-services
// @access  Private/Admin
const getPopularServicesReport = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const services = await getPopularServices(limit);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDailyReport, getRangeReport, getPopularServicesReport };
