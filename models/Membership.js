const mongoose = require('mongoose');

const membershipSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true }, // Free, Classic, Premium
  duration: { type: String, required: true }, // 3 Months, 6 Months, 12 Months
  price: { type: Number, required: true }, // in INR
  discountPrice: { type: Number },
  isPopular: { type: Boolean, default: false },
  features: [{ type: String }],
  description: { type: String }
}, {
  timestamps: true
});

module.exports = mongoose.model('Membership', membershipSchema);
