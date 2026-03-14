const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const { generateSlots } = require('../utils/slotGenerator');
const { sendBookingConfirmation } = require('../services/emailService');

// @desc    Get available slots for a given date and service
// @route   GET /api/bookings/slots?date=YYYY-MM-DD&serviceId=xxx
// @access  Public
const getAvailableSlots = async (req, res) => {
  try {
    const { date, serviceId } = req.query;

    if (!date || !serviceId) {
      return res.status(400).json({ message: 'Date and serviceId are required' });
    }

    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    // Get all non-cancelled bookings for this date
    const existingBookings = await Booking.find({
      date,
      status: { $nin: ['cancelled', 'expired'] },
    });

    const bookedSlots = existingBookings.map((b) => b.slotTime);
    const slots = generateSlots('09:00', '19:00', service.duration, bookedSlots);
    
    // Add price to each slot object
    const slotsWithPrice = slots.map(slot => ({
      ...slot,
      price: service.price
    }));

    res.json({ date, service: service.name, slots: slotsWithPrice });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res) => {
  try {
    const { serviceId, date, slotTime, notes } = req.body;

    if (!serviceId || !date || !slotTime) {
      return res.status(400).json({ message: 'serviceId, date, and slotTime are required' });
    }

    // Check for double booking
    const existing = await Booking.findOne({
      date,
      slotTime,
      status: { $nin: ['cancelled', 'expired'] },
    });
    if (existing) {
      return res.status(409).json({ message: 'This slot is already booked. Please choose another.' });
    }

    const booking = await Booking.create({
      user: req.user._id,
      service: serviceId,
      date,
      slotTime,
      notes,
    });

    // Update user booking count
    await User.findByIdAndUpdate(req.user._id, { $inc: { totalBookings: 1 } });

    const populated = await booking.populate(['user', 'service']);
    
    // Send Email Confirmation (Async)
    sendBookingConfirmation(populated.user, populated, populated.service).catch(err => 
      console.error('Email Error:', err.message)
    );

    res.status(201).json(populated);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ message: 'Slot already taken. Please choose another.' });
    }
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings for the logged-in user
// @route   GET /api/bookings/my
// @access  Private
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate('service', 'name price duration')
      .sort({ date: -1, slotTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Cancel a booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Customers can only cancel their own bookings
    if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to cancel this booking' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();
    res.json({ message: 'Booking cancelled successfully', booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get today's bookings (admin view)
// @route   GET /api/bookings/today
// @access  Private/Admin
const getTodayBookings = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const bookings = await Booking.find({ date: today })
      .populate('user', 'name phone email')
      .populate('service', 'name price duration')
      .sort({ slotTime: 1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Private/Admin
const getAllBookings = async (req, res) => {
  try {
    const { date, status } = req.query;
    const filter = {};
    if (date) filter.date = date;
    if (status) filter.status = status;

    const bookings = await Booking.find(filter)
      .populate('user', 'name phone email')
      .populate('service', 'name price duration')
      .sort({ date: -1, slotTime: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAvailableSlots,
  createBooking,
  getMyBookings,
  cancelBooking,
  getTodayBookings,
  getAllBookings,
};
