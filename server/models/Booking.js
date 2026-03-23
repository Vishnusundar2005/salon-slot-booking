const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: true,
    },
    date: {
      type: String, // Format: YYYY-MM-DD
      required: [true, 'Booking date is required'],
    },
    slotTime: {
      type: String, // Format: HH:mm (e.g. "10:00")
      required: [true, 'Slot time is required'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'expired', 'blocked'],
      default: 'confirmed',
    },
    reminderSent: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Index to optimize queries by date and slot time.
// Unique constraint removed to support re-booking cancelled/expired slots properly.
// Availability is managed via code-level checks in the booking controller.
bookingSchema.index({ date: 1, slotTime: 1 });

module.exports = mongoose.model('Booking', bookingSchema);
