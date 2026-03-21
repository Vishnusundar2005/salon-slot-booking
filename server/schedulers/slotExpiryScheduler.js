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

      // Use IST (India Standard Time) for all calculations
      const getISTDate = () => {
        const now = new Date();
        // IST is UTC + 5:30
        return new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
      };

      const istNow = getISTDate();
      const today = istNow.toISOString().split('T')[0];
      const currentTime = `${istNow.getUTCHours().toString().padStart(2, '0')}:${istNow
        .getUTCMinutes()
        .toString()
        .padStart(2, '0')}`;
      
      console.log(`🧹 [Expiry] Checking expiry for: ${currentTime} on ${today} (IST)`);

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
