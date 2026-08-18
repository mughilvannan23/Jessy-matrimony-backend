const mongoose = require('mongoose');

const successStorySchema = new mongoose.Schema({
  brideName: { type: String, required: true },
  groomName: { type: String, required: true },
  district: { type: String, required: true },
  story: { type: String, required: true },
  photos: [{ type: String }],
  weddingDate: { type: String, default: 'Recent Matrimony Success' },
  isFeatured: { type: Boolean, default: true }
}, {
  timestamps: true
});

module.exports = mongoose.model('SuccessStory', successStorySchema);
