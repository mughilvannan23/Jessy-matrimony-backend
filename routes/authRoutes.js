const express = require('express');
const router = express.Router();
const { register, registerStep1, login, logout, forgotPassword, verifyOtp, resetPassword, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.post('/register', upload.single('photo'), register);
router.post('/register-step1', upload.single('photo'), registerStep1);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
