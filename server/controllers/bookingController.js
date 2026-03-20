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

    // Build a map of booked slots with status and notes
    const bookedSlotsMap = {};
    existingBookings.forEach((b) => {
      bookedSlotsMap[b.slotTime] = {
        status: b.status,
        notes: b.notes,
      };
    });

    const slots = generateSlots('09:00', '19:00', service.duration, bookedSlotsMap);
    
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
    
    // Check if user or service is missing and log it
    if (!populated.user) console.warn('⚠️ [Booking] User population failed for booking ID:', populated._id);
    if (!populated.service) console.warn('⚠️ [Booking] Service population failed for booking ID:', populated._id);

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

// @desc    Update a booking (admin)
// @route   PUT /api/bookings/:id
// @access  Private/Admin
const updateBooking = async (req, res) => {
  try {
    const { serviceId, date, slotTime, status, notes } = req.body;
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // If date or time is changing, check for conflict
    if ((date && date !== booking.date) || (slotTime && slotTime !== booking.slotTime)) {
      const checkDate = date || booking.date;
      const checkSlot = slotTime || booking.slotTime;

      const existing = await Booking.findOne({
        _id: { $ne: req.params.id },
        date: checkDate,
        slotTime: checkSlot,
        status: { $nin: ['cancelled', 'expired'] },
      });

      if (existing) {
        return res.status(409).json({ message: 'Target slot is already occupied' });
      }
    }

    if (serviceId) booking.service = serviceId;
    if (date) booking.date = date;
    if (slotTime) booking.slotTime = slotTime;
    if (status) booking.status = status;
    if (notes !== undefined) booking.notes = notes;

    const updatedBooking = await booking.save();
    const populated = await updatedBooking.populate(['user', 'service']);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block a slot (admin/holiday)
// @route   POST /api/bookings/block
// @access  Private/Admin
const blockSlot = async (req, res) => {
  try {
    const { date, slotTime, notes } = req.body;

    if (!date || !slotTime) {
      return res.status(400).json({ message: 'Date and slotTime are required' });
    }

    // Check if already blocked or booked
    const existing = await Booking.findOne({
      date,
      slotTime,
      status: { $nin: ['cancelled', 'expired'] },
    });

    if (existing) {
      return res.status(409).json({ message: 'Slot is already occupied (booked or blocked)' });
    }

    // For blocked slots, we can use the admin's user ID or a system ID if preferred.
    // Here we use the admin's ID. We also need a "dummy" service or handle null service.
    // Let's find any active service to satisfy the model requirement, or we can make service optional in model.
    // Looking at the model, service is required.
    const service = await Service.findOne({ isActive: true });
    if (!service) {
      return res.status(500).json({ message: 'No active service found to associate with blocked slot' });
    }

    const block = await Booking.create({
      user: req.user._id,
      service: service._id,
      date,
      slotTime,
      status: 'blocked',
      notes: notes || 'Blocked by Admin',
    });

    res.status(201).json(block);
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
  updateBooking,
  blockSlot,
};
