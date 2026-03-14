const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const User = require('../models/User');

// @desc    Record a payment for a completed booking
// @route   POST /api/payments
// @access  Private/Admin
const recordPayment = async (req, res) => {
  try {
    const { bookingId, amount, method, reference } = req.body;

    if (!bookingId || !amount || !method) {
      return res.status(400).json({ message: 'bookingId, amount, and method are required' });
    }

    const booking = await Booking.findById(bookingId).populate('user service');
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Check if payment already exists
    const existingPayment = await Payment.findOne({ booking: bookingId });
    if (existingPayment) {
      return res.status(400).json({ message: 'Payment already recorded for this booking' });
    }

    const payment = await Payment.create({
      booking: bookingId,
      user: booking.user._id,
      amount,
      method,
      reference,
      recordedBy: req.user._id,
    });

    // Mark booking as completed
    booking.status = 'completed';
    await booking.save();

    // Update user total spent
    await User.findByIdAndUpdate(booking.user._id, { $inc: { totalSpent: amount } });

    res.status(201).json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments (admin)
// @route   GET /api/payments
// @access  Private/Admin
const getAllPayments = async (req, res) => {
  try {
    const payments = await Payment.find()
      .populate('booking', 'date slotTime status')
      .populate('user', 'name phone')
      .populate('recordedBy', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single payment by ID
// @route   GET /api/payments/:id
// @access  Private/Admin
const getPaymentById = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('booking')
      .populate('user', 'name phone')
      .populate('recordedBy', 'name');
    if (!payment) return res.status(404).json({ message: 'Payment not found' });
    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { recordPayment, getAllPayments, getPaymentById };
