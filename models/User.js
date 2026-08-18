const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  profileId: {
    type: String,
    unique: true,
    required: true,
    default: () => 'JM' + Math.floor(100000 + Math.random() * 900000)
  },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  mobile: { type: String, required: true },
  mobileVerified: { type: Boolean, default: false },

  // Basic Info
  profileFor: { type: String, enum: ['Self', 'Sister', 'Brother', 'Daughter', 'Son', 'Friend', 'Relative'], default: 'Self' },
  gender: { type: String, enum: ['Bride', 'Groom', 'Female', 'Male'], required: true },
  dateOfBirth: { type: Date },
  age: { type: Number, required: true, min: 18, max: 70 },
  height: { type: String, default: "5'6\" (167 cm)" },
  weight: { type: String, default: '65 kg' },
  maritalStatus: { type: String, enum: ['Never Married', 'Divorced', 'Widowed', 'Awaiting Divorce'], default: 'Never Married' },
  motherTongue: { type: String, default: 'Tamil' },

  // Religious & Cultural
  religion: { type: String, default: 'Hindu' },
  caste: { type: String, default: 'Vanniyar' },
  subCaste: { type: String, default: 'General' },
  
  // Tamil Nadu Location
  district: { type: String, required: true }, // e.g. Chennai, Trichy, Coimbatore
  city: { type: String, default: '' },
  address: { type: String, default: '' },

  // Education & Career
  education: { type: String, default: 'B.E / B.Tech' },
  occupation: { type: String, default: 'Software Engineer' },
  income: { type: String, default: '₹6 - ₹10 Lakhs PA' },

  // Family Background
  familyType: { type: String, enum: ['Nuclear Family', 'Joint Family'], default: 'Nuclear Family' },
  fatherOccupation: { type: String, default: 'Business / Retired' },
  motherOccupation: { type: String, default: 'Homemaker' },
  siblings: { type: String, default: '1 Brother, 1 Sister' },

  // Horoscope / Astrological Details
  horoscope: {
    raasi: { type: String, default: 'Mesham (Aries)' },
    nakshatra: { type: String, default: 'Ashwini' },
    dosham: { type: String, default: 'No Dosham' },
    birthTime: { type: String, default: '08:30 AM' },
    birthPlace: { type: String, default: 'Tamil Nadu' }
  },

  // About & Expectations
  aboutMe: { type: String, default: 'Looking for a compatible life partner from Tamil Nadu.' },
  expectations: { type: String, default: 'Educated, well-cultured partner from Tamil Nadu.' },

  // Photos & Verifications
  photos: [{ type: String }],
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80' },
  profileVerified: { type: Boolean, default: false },
  
  // Membership & Status
  membership: { type: String, enum: ['free', 'premium', 'Free', 'Premium'], default: 'free' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  premiumMember: { type: Boolean, default: false },
  membershipPlan: { type: String, enum: ['Free', 'Classic', 'Premium'], default: 'Free' },
  membershipExpiry: { type: Date },

  // Activity & Shortlists
  shortlistedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  shortlistedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],

  // Password reset token fields
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  otpCode: String,
  otpExpire: Date
}, {
  timestamps: true
});

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
