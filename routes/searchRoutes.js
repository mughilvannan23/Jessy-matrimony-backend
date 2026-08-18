const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/authMiddleware');
const { searchProfiles } = require('../controllers/searchController');

router.get('/', optionalAuth, searchProfiles);

module.exports = router;
