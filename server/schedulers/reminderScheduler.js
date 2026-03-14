const cron = require('node-cron');
const { sendUpcomingReminders } = require('../services/reminderService');

/**
 * Starts a cron job that runs every minute to send upcoming appointment reminders.
 */
const startReminderScheduler = () => {
  cron.schedule('* * * * *', async () => {
    await sendUpcomingReminders();
  });

  console.log('✅ Reminder scheduler started.');
};

module.exports = { startReminderScheduler };
