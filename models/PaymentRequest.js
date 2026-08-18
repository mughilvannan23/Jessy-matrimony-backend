const mongoose = require('mongoose');

const paymentRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userMobile: { type: String, required: true },
  userProfileId: { type: String },
  planName: { type: String, required: true }, // 'Classic', 'Premium'
  amount: { type: Number, required: true },
  transactionId: { type: String, required: true, trim: true }, // UTR / Transaction reference
  paymentMethod: { type: String, default: 'UPI QR Code' },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  rejectionReason: { type: String, default: '' },
  approvedAt: { type: Date },
  rejectedAt: { type: Date }
}, {
  timestamps: true
});

module.exports = mongoose.model('PaymentRequest', paymentRequestSchema);
