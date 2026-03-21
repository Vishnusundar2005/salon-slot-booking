const Booking = require('../models/Booking');
const { sendReminder } = require('./emailService');

/**
 * Checks for bookings starting in the next 5-10 minutes and sends reminders.
 * Called by the cron scheduler every minute.
 */
const sendUpcomingReminders = async () => {
  try {
    // Use IST (India Standard Time) for all calculations
    const getISTDate = () => {
      const now = new Date();
      // IST is UTC + 5:30
      return new Date(now.getTime() + (5.5 * 60 * 60 * 1000));
    };

    const istNow = getISTDate();
    const today = istNow.toISOString().split('T')[0];

    const formatTime = (d) => {
      return `${d.getUTCHours().toString().padStart(2, '0')}:${d.getUTCMinutes().toString().padStart(2, '0')}`;
    };

    const windowStart = formatTime(new Date(istNow.getTime() + 5 * 60000));
    const windowEnd = formatTime(new Date(istNow.getTime() + 10 * 60000));

    console.log(`⏰ [Reminder] Checking IST window: ${windowStart} - ${windowEnd} on ${today}`);

    const bookings = await Booking.find({
      date: today,
      status: 'confirmed',
      reminderSent: false,
      slotTime: { $gte: windowStart, $lte: windowEnd },
    })
      .populate('user', 'name phone email')
      .populate('service', 'name price');

    for (const booking of bookings) {
      await sendReminder(booking.user, booking, booking.service);
      booking.reminderSent = true;
      await booking.save();
    }
  } catch (error) {
    console.error('❌ Error in sendUpcomingReminders:', error.message);
  }
};

module.exports = { sendUpcomingReminders };
