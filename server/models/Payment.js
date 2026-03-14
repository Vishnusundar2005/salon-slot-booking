const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
      unique: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Payment amount is required'],
      min: 0,
    },
    method: {
      type: String,
      enum: ['cash', 'upi', 'card'],
      required: [true, 'Payment method is required'],
    },
    reference: {
      // UPI transaction ID or any payment reference
      type: String,
      trim: true,
    },
    recordedBy: {
      // Admin who recorded this payment
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
