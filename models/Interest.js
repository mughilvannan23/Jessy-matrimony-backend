const mongoose = require('mongoose');

const interestSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  message: {
    type: String,
    default: 'Hi, I found your profile on Jessy Matrimony and would like to connect.'
  }
}, {
  timestamps: true
});

// Ensure uniqueness so user cannot send multiple pending interests to same person
interestSchema.index({ sender: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model('Interest', interestSchema);
