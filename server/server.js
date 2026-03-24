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

  // 4. Keep-alive ping to prevent Render free tier cold starts (every 14 minutes)
  if (process.env.NODE_ENV === 'production' && process.env.RENDER_EXTERNAL_URL) {
    const https = require('https');
    setInterval(() => {
      const url = `${process.env.RENDER_EXTERNAL_URL}/`;
      https.get(url, (res) => {
        console.log(`⏱️ Keep-alive ping: ${res.statusCode}`);
      }).on('error', (err) => {
        console.error('Keep-alive ping error:', err.message);
      });
    }, 14 * 60 * 1000); // 14 minutes
  }
};

startServer();
