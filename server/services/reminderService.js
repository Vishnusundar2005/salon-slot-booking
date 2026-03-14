const Booking = require('../models/Booking');
const { sendReminder } = require('./emailService');

/**
 * Checks for bookings starting in the next 5-10 minutes and sends reminders.
 * Called by the cron scheduler every minute.
 */
const sendUpcomingReminders = async () => {
  try {
    const now = new Date();
    const today = now.toLocaleDateString('en-CA'); // Gets YYYY-MM-DD in local time

    // Current time + 5 min window (e.g. "10:05" to "10:10")
    const addMins = (date, mins) => new Date(date.getTime() + mins * 60000);
    const format = (d) =>
      `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

    const windowStart = format(addMins(now, 5));
    const windowEnd = format(addMins(now, 10));

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
