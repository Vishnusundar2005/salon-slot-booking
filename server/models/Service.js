const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    duration: {
      // Duration in minutes
      type: Number,
      required: [true, 'Duration is required'],
      min: 5,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    category: {
      type: String,
      enum: ['hair', 'beard', 'spa', 'other'],
      default: 'other',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Service', serviceSchema);
