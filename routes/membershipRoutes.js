const express = require('express');
const router = express.Router();
const { getMemberships, createPaymentOrder, verifyPayment, getUpiDetails, submitPaymentRequest } = require('../controllers/membershipController');
const { protect } = require('../middleware/authMiddleware');

router.get('/', getMemberships);
router.get('/upi-details', getUpiDetails);
router.post('/submit-payment', protect, submitPaymentRequest);
router.post('/payment', protect, createPaymentOrder);
router.post('/payment/verify', protect, verifyPayment);

module.exports = router;
