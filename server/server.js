require('dotenv').config();
const app = require('./app');
const connectDB = require('./config/db');

// Schedulers
const { startReminderScheduler } = require('./schedulers/reminderScheduler');
const { startSlotExpiryScheduler } = require('./schedulers/slotExpiryScheduler');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // 1. Connect to database
  await connectDB();

  // 2. Start background schedulers
  startReminderScheduler();
  startSlotExpiryScheduler();

  // 3. Start HTTP server
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  });
};

startServer();
