const express = require('express');
const router = express.Router();
const { sendInterest, getSentInterests, getReceivedInterests, updateInterestStatus } = require('../controllers/interestController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/', sendInterest);
router.get('/sent', getSentInterests);
router.get('/received', getReceivedInterests);
router.put('/:id', updateInterestStatus);

module.exports = router;
