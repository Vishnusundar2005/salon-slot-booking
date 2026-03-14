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
      enum: ['pending', 'confirmed', 'completed', 'cancelled', 'expired'],
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

// Compound index to prevent double booking the same slot on the same date
bookingSchema.index({ date: 1, slotTime: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);
