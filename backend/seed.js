require('dotenv').config();
const mongoose = require('mongoose');
const { User } = require('./models');

const MONGO_URI = process.env.MONGO_URI;

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      console.log('Admin already exists:', existingAdmin.name);
      process.exit(0);
    }

    const admin = await User.create({
      id: 'u1',
      name: 'Mario Rossi',
      email: 'coordinatore@masterpiscine.it',
      role: 'admin',
      password: 'admin'
    });

    console.log('Admin created successfully:', admin.name);
    process.exit(0);
  } catch (err) {
    console.error('Error seeding DB:', err);
    process.exit(1);
  }
}
seed();
