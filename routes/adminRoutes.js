const express = require('express');
const router = express.Router();
const { 
  getDashboardStats, 
  verifyProfile, 
  deleteUser, 
  getDistrictAnalytics, 
  exportUsersCSV, 
  getContactQueries, 
  getAllUsers, 
  updateUserStatus,
  getPaymentRequests,
  approvePaymentRequest,
  rejectPaymentRequest,
  getUpiSettings,
  updateUpiSettings
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.use(protect, adminOnly);

router.get('/dashboard', getDashboardStats);
router.get('/users', getAllUsers);
router.put('/verify/:id', verifyProfile);
router.put('/user/:id/status', updateUserStatus);
router.delete('/user/:id', deleteUser);
router.get('/district-stats', getDistrictAnalytics);
router.get('/export-csv', exportUsersCSV);
router.get('/queries', getContactQueries);

// Payment Requests & UPI Settings
router.get('/payment-requests', getPaymentRequests);
router.put('/payment-requests/:id/approve', approvePaymentRequest);
router.put('/payment-requests/:id/reject', rejectPaymentRequest);
router.get('/upi-settings', getUpiSettings);
router.put('/upi-settings', updateUpiSettings);

module.exports = router;
