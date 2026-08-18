const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'jessy_matrimony_super_secret_jwt_key_2026_tn', {
    expiresIn: '7d'
  });
};

const generateRefreshToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'jessy_matrimony_refresh_secret_key_2026', {
    expiresIn: '30d'
  });
};

// @route   POST /api/auth/register-step1
exports.registerStep1 = async (req, res) => {
  try {
    const { name, email, password, mobile, gender, age, profileFor } = req.body;

    if (!name || !email || !password || !mobile) {
      return res.status(400).json({ success: false, message: 'Please fill in Name, Email, Password, and Mobile Number.' });
    }

    const uploadedPhotoUrl = req.file ? `/uploads/${req.file.filename}` : null;

    let user = await User.findOne({ email });
    if (user) {
      // If user exists and is already verified/completed
      if (user.profileVerified) {
        return res.status(400).json({ success: false, message: 'Email address is already registered.' });
      }
      // Update draft step 1 info
      user.name = name;
      user.password = password;
      user.mobile = mobile;
      user.gender = gender || 'Bride';
      user.age = Number(age) || 24;
      user.profileFor = profileFor || 'Self';
      if (uploadedPhotoUrl) {
        user.avatar = uploadedPhotoUrl;
        if (!user.photos.includes(uploadedPhotoUrl)) {
          user.photos.push(uploadedPhotoUrl);
        }
      }
      await user.save();
    } else {
      const defaultAvatar = uploadedPhotoUrl || ((gender === 'Bride' || gender === 'Female')
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

      user = await User.create({
        name,
        email,
        password,
        mobile,
        gender: gender || 'Bride',
        age: Number(age) || 24,
        profileFor: profileFor || 'Self',
        district: 'Chennai',
        religion: 'Hindu',
        caste: 'Vanniyar',
        education: 'Undergraduate',
        occupation: 'Professional',
        avatar: defaultAvatar,
        photos: [defaultAvatar],
        profileVerified: false, // Unverified until Admin verifies!
        premiumMember: false,
        membership: 'free',
        membershipPlan: 'Free',
        status: 'active',
        role: 'user'
      });
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'Step 1 saved! Admin notified for profile verification.',
      token,
      refreshToken,
      user: userObj
    });
  } catch (error) {
    console.error('Register step 1 error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during Step 1' });
  }
};

// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const {
      name, email, password, mobile, gender, age, profileFor, district, religion, caste, education, occupation
    } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email address is already registered.' });
    }

    const uploadedPhotoUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const defaultAvatar = uploadedPhotoUrl || ((gender === 'Bride' || gender === 'Female')
      ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
      : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80');

    const user = await User.create({
      name,
      email,
      password,
      mobile,
      gender: gender || 'Bride',
      age: Number(age) || 24,
      profileFor: profileFor || 'Self',
      district: district || 'Chennai',
      religion: religion || 'Hindu',
      caste: caste || 'Vanniyar',
      education: education || 'B.E / B.Tech',
      occupation: occupation || 'Software Professional',
      avatar: defaultAvatar,
      photos: [defaultAvatar],
      profileVerified: false,
      premiumMember: false,
      membership: 'free',
      membershipPlan: 'Free',
      status: 'active',
    });

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'Registration successful! Welcome to Jessy Matrimony.',
      token,
      refreshToken,
      user: userObj
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during registration' });
  }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Your account has been deactivated by Admin. Please contact support.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      message: 'Login successful',
      token,
      refreshToken,
      user: userObj
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login' });
  }
};

// @route   POST /api/auth/logout
exports.logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// @route   POST /api/auth/forgot-password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otp;
    user.otpExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    res.json({
      success: true,
      message: `OTP sent to your registered email/mobile. (Demo OTP: ${otp})`,
      demoOtp: otp
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error processing forgot password request' });
  }
};

// @route   POST /api/auth/verify-otp
exports.verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const user = await User.findOne({ email, otpCode: otp, otpExpire: { $gt: Date.now() } });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP code' });
    }

    user.mobileVerified = true;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'OTP verified successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying OTP' });
  }
};

// @route   POST /api/auth/reset-password
exports.resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully! You can now login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error resetting password' });
  }
};

// @route   GET /api/auth/me
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile' });
  }
};
