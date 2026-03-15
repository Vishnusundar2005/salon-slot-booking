
require('dotenv').config();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const Service = require('../models/Service');
const User = require('../models/User');
const connectDB = require('../config/db');
const { updateBooking, blockSlot, getAvailableSlots } = require('../controllers/bookingController');

const mockRes = () => {
  const res = {};
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return res;
  };
  return res;
};

const runTests = async () => {
  await connectDB();
  console.log('Connected to DB for verification...');

  // 1. Setup - Get a user and a service
  const user = await User.findOne({ role: 'admin' });
  const service = await Service.findOne({ isActive: true });

  if (!user || !service) {
    console.error('Missing seed data. Please run node seed.js first.');
    process.exit(1);
  }

  const testDate = '2026-05-20';
  const testSlot = '10:00';

  // 2. Clear existing bookings for test date
  await Booking.deleteMany({ date: testDate });
  console.log(`Cleared bookings for ${testDate}`);

  // 3. Test blockSlot (Holiday)
  console.log('\n--- Testing blockSlot ---');
  const blockReq = {
    user: user,
    body: {
      date: testDate,
      slotTime: testSlot,
      notes: 'Testing Holiday Block'
    }
  };
  const blockRes = mockRes();
  await blockSlot(blockReq, blockRes);

  if (blockRes.statusCode === 201) {
    console.log('✅ Slot blocked successfully');
  } else {
    console.error('❌ Failed to block slot:', blockRes.body);
  }

  // 4. Verify slot is unavailable
  console.log('\n--- Verifying slot availability ---');
  const availReq = {
    query: {
      date: testDate,
      serviceId: service._id.toString()
    }
  };
  const availRes = mockRes();
  await getAvailableSlots(availReq, availRes);

  const slotStatus = availRes.body.slots.find(s => s.time === testSlot);
  if (slotStatus && slotStatus.isBooked === true && slotStatus.status === 'blocked' && slotStatus.notes === 'Testing Holiday Block') {
    console.log('✅ Blocked slot correctly marked as blocked with metadata');
  } else {
    console.error('❌ Blocked slot metadata mismatch:', slotStatus);
  }

  // 5. Test updateBooking
  console.log('\n--- Testing updateBooking ---');
  const bookingToUpdate = blockRes.body;
  const updateReq = {
    params: { id: bookingToUpdate._id },
    body: {
      slotTime: '11:00',
      notes: 'Updated note'
    }
  };
  const updateRes = mockRes();
  await updateBooking(updateReq, updateRes);

  if (updateRes.body.slotTime === '11:00' && updateRes.body.notes === 'Updated note') {
    console.log('✅ Booking updated successfully');
  } else {
    console.error('❌ Failed to update booking:', updateRes.body);
  }

  // 6. Final check - verify old slot is now free and new slot is taken
  const finalAvailRes = mockRes();
  await getAvailableSlots(availReq, finalAvailRes);
  const oldSlot = finalAvailRes.body.slots.find(s => s.time === testSlot);
  const newSlot = finalAvailRes.body.slots.find(s => s.time === '11:00');

  if (oldSlot && !oldSlot.isBooked && newSlot && newSlot.isBooked) {
    console.log('✅ Slots correctly updated in availability');
  } else {
    console.error('❌ Slot availability mismatch after update');
  }

  console.log('\nVerification Complete!');
  process.exit(0);
};

runTests().catch(err => {
  console.error('Test Error:', err);
  process.exit(1);
});
