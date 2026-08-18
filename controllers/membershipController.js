const Membership = require('../models/Membership');
const User = require('../models/User');
const PaymentRequest = require('../models/PaymentRequest');
const SiteSetting = require('../models/SiteSetting');

// @route   GET /api/memberships/upi-details
exports.getUpiDetails = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne({ key: 'payment_settings' });
    if (!settings) {
      settings = {
        upiId: '9840123456@upi',
        upiName: 'Jessy Matrimony Services',
        helplineMobile: '+91 98401 23456'
      };
    }
    res.json({
      success: true,
      upiId: settings.upiId,
      upiName: settings.upiName,
      helplineMobile: settings.helplineMobile
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching UPI details' });
  }
};

// @route   POST /api/memberships/submit-payment
exports.submitPaymentRequest = async (req, res) => {
  try {
    const { planName, amount, transactionId } = req.body;
    const user = req.user;

    if (!transactionId || transactionId.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Please enter your Transaction ID or UTR number.' });
    }

    const paymentRequest = await PaymentRequest.create({
      user: user._id,
      userName: user.name,
      userEmail: user.email,
      userMobile: user.mobile,
      userProfileId: user.profileId,
      planName: planName || 'Classic',
      amount: Number(amount) || 1999,
      transactionId: transactionId.trim(),
      status: 'pending'
    });

    res.status(201).json({
      success: true,
      message: 'Payment request submitted successfully! Admin will verify your Transaction ID and activate your plan.',
      paymentRequest
    });
  } catch (error) {
    console.error('Payment submission error:', error);
    res.status(500).json({ success: false, message: error.message || 'Error submitting payment request' });
  }
};

// @route   GET /api/memberships
exports.getMemberships = async (req, res) => {
  try {
    let plans = await Membership.find().sort({ price: 1 });

    // Fallback default plans if db is empty
    if (plans.length === 0) {
      plans = [
        {
          _id: 'free',
          name: 'Free',
          duration: 'Unlimited',
          price: 0,
          isPopular: false,
          description: 'Basic access to start searching for your match in Tamil Nadu.',
          features: [
            'Create Complete Profile',
            'Browse Profiles in 38 Districts',
            'Send up to 5 Express Interests',
            'Basic Search Filters'
          ]
        },
        {
          _id: 'classic',
          name: 'Classic',
          duration: '3 Months',
          price: 2499,
          discountPrice: 1999,
          isPopular: true,
          description: 'Popular choice for active bride & groom searchers.',
          features: [
            'Unlimited Profile Search & Filters',
            'View Verified Contact Numbers & Email',
            'Send Unlimited Express Interests',
            'Direct Horoscope Compatibility View',
            'WhatsApp Instant Match Alerts'
          ]
        },
        {
          _id: 'premium',
          name: 'Premium',
          duration: '6 Months',
          price: 4999,
          discountPrice: 3999,
          isPopular: false,
          description: 'VIP matchmaking experience with profile boost & dedicated manager.',
          features: [
            'Priority Listing & Profile Boost',
            'Dedicated Relationship Manager',
            'Unlimited Contact & Address Access',
            'Verified Badge & Trust Shield',
            'Horoscope Matching Certificate',
            'Direct WhatsApp Assistance'
          ]
        }
      ];
    }

    res.json({ success: true, count: plans.length, plans });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching membership plans' });
  }
};

// @route   POST /api/payment
exports.createPaymentOrder = async (req, res) => {
  try {
    const { planName, amount } = req.body;
    const orderId = 'order_' + Math.random().toString(36).substring(2, 12);

    res.json({
      success: true,
      order: {
        id: orderId,
        amount: (amount || 1999) * 100, // in paise
        currency: 'INR',
        receipt: 'rcpt_' + Date.now(),
        planName: planName || 'Classic'
      },
      key: process.env.RAZORPAY_KEY_ID || 'rzp_test_jessy_matrimony_key'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error initializing payment' });
  }
};

// @route   POST /api/payment/verify
exports.verifyPayment = async (req, res) => {
  try {
    const { planName } = req.body;
    const userId = req.user._id;

    const expiryMonths = planName === 'Premium' ? 6 : 3;
    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + expiryMonths);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        premiumMember: true,
        membershipPlan: planName || 'Classic',
        membershipExpiry: expiryDate
      },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: `Congratulations! Your profile has been upgraded to ${planName} membership!`,
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error verifying payment' });
  }
};
