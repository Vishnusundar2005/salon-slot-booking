const Payment = require('../models/Payment');
const Booking = require('../models/Booking');

/**
 * Get revenue summary for a given date range.
 * @param {string} startDate - YYYY-MM-DD
 * @param {string} endDate   - YYYY-MM-DD
 */
const getRevenueByDateRange = async (startDate, endDate) => {
  const payments = await Payment.find({
    createdAt: {
      $gte: new Date(`${startDate}T00:00:00Z`),
      $lte: new Date(`${endDate}T23:59:59Z`),
    },
  }).populate('booking', 'date service');

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const cashRevenue = payments
    .filter((p) => p.method?.toLowerCase() === 'cash')
    .reduce((sum, p) => sum + p.amount, 0);
  const upiRevenue = payments
    .filter((p) => p.method?.toLowerCase() === 'upi')
    .reduce((sum, p) => sum + p.amount, 0);

  return {
    totalPayments: payments.length,
    totalRevenue,
    cashRevenue,
    upiRevenue,
    payments,
  };
};

/**
 * Get popular services by number of bookings.
 * @param {number} limit - How many top services to return
 */
const getPopularServices = async (limit = 5) => {
  const result = await Booking.aggregate([
    { $match: { status: { $in: ['confirmed', 'completed'] } } },
    { $group: { _id: '$service', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'services',
        localField: '_id',
        foreignField: '_id',
        as: 'service',
      },
    },
    { $unwind: '$service' },
    { $project: { _id: '$_id', name: '$service.name', count: 1 } },
  ]);
  return result;
};

module.exports = { getRevenueByDateRange, getPopularServices };
