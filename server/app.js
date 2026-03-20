const express = require('express');
const cors = require('cors');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reportRoutes = require('./routes/reportRoutes');

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reports', reportRoutes);

// --- Health Check & Debug ---
app.get('/', (req, res) => {
  res.json({ message: 'Slotify API is running (Diagnostic v6) 🚀' });
});

app.get('/api/debug-env', async (req, res) => {
  const net = require('net');
  const checkPort = (host, port) => {
    return new Promise((resolve) => {
      const socket = new net.Socket();
      socket.setTimeout(3000);
      socket.on('connect', () => { socket.destroy(); resolve(true); });
      socket.on('timeout', () => { socket.destroy(); resolve('timeout'); });
      socket.on('error', (err) => { socket.destroy(); resolve(err.message); });
      socket.connect(port, host);
    });
  };

  const smtp465 = await checkPort('smtp.gmail.com', 465);
  const smtp587 = await checkPort('smtp.gmail.com', 587);

  res.json({
    email_user_set: !!process.env.EMAIL_USER,
    email_pass_set: !!process.env.EMAIL_PASS,
    node_env: process.env.NODE_ENV,
    connectivity: {
      'smtp.gmail.com:465': smtp465,
      'smtp.gmail.com:587': smtp587
    }
  });
});

// --- Error Handling ---
app.use(notFound);
app.use(errorHandler);

module.exports = app;
