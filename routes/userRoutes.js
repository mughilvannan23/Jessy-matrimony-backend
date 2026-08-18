const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  updateUserProfile, 
  uploadPhotos, 
  setMainAvatar, 
  deletePhoto, 
  toggleShortlist 
} = require('../controllers/userController');
const { protect, optionalAuth } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.get('/', optionalAuth, getUsers);
router.get('/:id', optionalAuth, getUserById);
router.put('/:id', protect, updateUserProfile);
router.post('/:id/photos', protect, upload.array('photos', 5), uploadPhotos);
router.put('/:id/avatar', protect, setMainAvatar);
router.delete('/:id/photos', protect, deletePhoto);
router.post('/shortlist/:id', protect, toggleShortlist);

module.exports = router;
