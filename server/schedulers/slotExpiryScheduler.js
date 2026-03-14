const cron = require('node-cron');
const Booking = require('../models/Booking');
const { sendSlotExpired } = require('../services/emailService');

/**
 * Marks past confirmed bookings as expired every 5 minutes.
 */
const startSlotExpiryScheduler = () => {
  // Runs every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    try {

      const now = new Date();
      const today = now.toISOString().split('T')[0];
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      // Find confirmed bookings from today that have already passed
      const expiredBookings = await Booking.find({
        date: today,
        status: 'confirmed',
        slotTime: { $lt: currentTime },
      })
        .populate('user', 'name phone email')
        .populate('service', 'name');

      for (const booking of expiredBookings) {
        booking.status = 'expired';
        await booking.save();
        await sendSlotExpired(booking.user, booking, booking.service);
      }
    } catch (error) {
      console.error('❌ Error in SlotExpiryScheduler:', error.message);
    }
  });

  console.log('✅ Slot expiry scheduler started.');
};

module.exports = { startSlotExpiryScheduler };
