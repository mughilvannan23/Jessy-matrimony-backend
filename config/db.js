const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jessy_matrimony');
    console.log(`[MongoDB Connected] Host: ${conn.connection.host}`);

    // Auto-create default admin if not exists
    const User = require('../models/User');
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      await User.create({
        name: 'Jessy Matrimony Admin',
        email: 'admin@jessymatrimony.com',
        password: 'admin123',
        role: 'admin',
        mobile: '+91 98400 00000',
        gender: 'Groom',
        age: 35,
        district: 'Chennai',
        status: 'active',
        membership: 'premium',
        profileVerified: true,
        premiumMember: true,
        membershipPlan: 'Premium'
      });
      console.log('[Auto-Seed] Default Admin created: admin@jessymatrimony.com / admin123');
    }
  } catch (error) {
    console.error(`[MongoDB Connection Error] ${error.message}`);
  }
};

module.exports = connectDB;
