/**
 * seed.js — Populates the slotify database with initial data.
 *
 * Run: node seed.js
 *
 * Seeds:
 *  - 1 Super Admin (Vishnusundar)
 *  - 1 Admin user
 *  - 1 Customer user
 *  - 5 Salon services (Haircut, Beard Trim, Hair Spa, Hair Colouring, Facial)
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Service = require('./models/Service');

const connectDB = require('./config/db');

const superAdminUser = {
  name: 'Vishnusundar',
  email: 'skvishnu0204@gmail.com',
  password: 'Vishnu@007',
  phone: '+919999999990',
  role: 'superadmin',
};

const adminUser = {
  name: 'Admin',
  email: 'admin@slotify.com',
  password: 'Admin@123',
  phone: '+919999999999',
  role: 'admin',
};

const customerUser = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'Customer@123',
  phone: '+919876543210',
  role: 'customer',
};

const services = [
  {
    name: 'Haircut',
    description: 'Classic haircut and styling for all hair types.',
    price: 150,
    duration: 30,
    category: 'hair',
  },
  {
    name: 'Beard Trim',
    description: 'Professional beard shaping and trimming.',
    price: 100,
    duration: 20,
    category: 'beard',
  },
  {
    name: 'Hair Spa',
    description: 'Deep conditioning hair spa treatment.',
    price: 500,
    duration: 60,
    category: 'spa',
  },
  {
    name: 'Hair Colouring',
    description: 'Full hair colouring with premium dyes.',
    price: 800,
    duration: 90,
    category: 'hair',
  },
  {
    name: 'Facial',
    description: 'Refreshing skin care facial treatment.',
    price: 400,
    duration: 45,
    category: 'spa',
  },
];

const seed = async () => {
  await connectDB();

  console.log('\n🌱 Seeding database...\n');

  // --- Clear existing data ---
  await User.deleteMany({});
  await Service.deleteMany({});
  console.log('🗑️  Cleared existing Users and Services');

  // --- Create users ---
  const superAdmin = await User.create(superAdminUser);
  const admin = await User.create(adminUser);
  const customer = await User.create(customerUser);
  console.log(`👑 Super Admin created: ${superAdmin.email}`);
  console.log(`👤 Admin created:       ${admin.email}`);
  console.log(`👤 Customer created:    ${customer.email}`);

  // --- Create services ---
  const createdServices = await Service.insertMany(services);
  console.log(`\n💈 Services seeded (${createdServices.length}):`);
  createdServices.forEach((s) =>
    console.log(`   • ${s.name} — ₹${s.price} | ${s.duration} min`)
  );

  console.log('\n✅ Database seeded successfully!\n');
  console.log('─────────────────────────────────────────────');
  console.log('Super Admin login: skvishnu0204@gmail.com / Vishnu@007');
  console.log('Admin login:       admin@slotify.com      / Admin@123');
  console.log('Customer login:    john@example.com       / Customer@123');
  console.log('─────────────────────────────────────────────\n');

  process.exit(0);
};

seed().catch((err) => {
  console.error('❌ Seeding failed:', err.message);
  process.exit(1);
});
