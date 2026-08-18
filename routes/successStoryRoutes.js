const express = require('express');
const router = express.Router();
const { getSuccessStories, createSuccessStory, submitContactQuery } = require('../controllers/successStoryController');
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');

router.get('/', getSuccessStories);
router.post('/', protect, adminOnly, createSuccessStory);
router.post('/contact', submitContactQuery);

module.exports = router;
