const mongoose = require('mongoose');

const siteSettingSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true }, // 'payment_settings'
  upiId: { type: String, default: '9840123456@upi' },
  upiName: { type: String, default: 'Jessy Matrimony Services' },
  helplineMobile: { type: String, default: '+91 98401 23456' }
}, {
  timestamps: true
});

module.exports = mongoose.model('SiteSetting', siteSettingSchema);
