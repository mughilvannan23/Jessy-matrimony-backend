const User = require('../models/User');

// @route   GET /api/users
exports.getUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const query = { role: 'user', status: { $ne: 'inactive' } };
    if (req.query.gender) query.gender = req.query.gender;
    if (req.query.district) query.district = new RegExp(req.query.district, 'i');
    if (req.query.verified === 'true') query.profileVerified = true;
    if (req.query.verified === 'false') query.profileVerified = false;
    if (req.query.premium === 'true') query.premiumMember = true;

    const users = await User.find(query)
      .select('-password')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      count: users.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      users
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profiles' });
  }
};

// @route   GET /api/users/:id
exports.getUserById = async (req, res) => {
  try {
    const requestingUser = req.user;
    if (!requestingUser) {
      return res.status(401).json({
        success: false,
        message: 'Register or Login required to view full profile details',
        loginRequired: true
      });
    }

    const user = await User.findById(req.params.id).select('-password');
    if (!user || user.status === 'inactive' || user.role === 'admin') {
      return res.status(404).json({ success: false, message: 'Profile not found or inaccessible' });
    }

    // Non-admin users cannot view unverified profiles until Admin approves
    if (requestingUser.role !== 'admin' && !user.profileVerified) {
      return res.status(403).json({
        success: false,
        message: 'This profile is currently pending Admin verification before being publicly viewable.'
      });
    }

    const userObj = user.toObject();

    // Mask sensitive contact details if requesting user is not premium or viewing another profile
    const isOwner = requestingUser._id.toString() === user._id.toString();
    const isPremium = requestingUser.premiumMember || requestingUser.membership === 'premium' || requestingUser.membershipPlan === 'Premium';
    const isAdmin = requestingUser.role === 'admin';

    if (!isOwner && !isPremium && !isAdmin) {
      userObj.mobile = '+91 XXXXX XXXXX (Upgrade to view)';
      userObj.email = 'XXXXX@XXXXX.com (Upgrade to view)';
      userObj.address = 'Tamil Nadu (Contact details locked for free users)';
    }

    res.json({ success: true, user: userObj });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching profile details' });
  }
};

// @route   PUT /api/users/:id
exports.updateUserProfile = async (req, res) => {
  try {
    // Only owner or admin can update
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized profile edit' });
    }

    const fieldsToUpdate = { ...req.body };
    delete fieldsToUpdate.password;
    delete fieldsToUpdate.role;

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: fieldsToUpdate },
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Error updating profile' });
  }
};

// @route   POST /api/users/:id/photos
exports.uploadPhotos = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized photo upload' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No image files uploaded' });
    }

    const newPhotoUrls = req.files.map(file => `/uploads/${file.filename}`);
    user.photos = [...user.photos, ...newPhotoUrls];

    // If avatar not set or default, use first photo
    if (!user.avatar || user.avatar.includes('unsplash')) {
      user.avatar = newPhotoUrls[0];
    }

    await user.save();

    res.json({
      success: true,
      message: 'Photos uploaded successfully!',
      photos: user.photos,
      avatar: user.avatar,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error uploading photos' });
  }
};

// @route   PUT /api/users/:id/avatar
exports.setMainAvatar = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    const { photoUrl } = req.body;
    if (!photoUrl) {
      return res.status(400).json({ success: false, message: 'Photo URL is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.avatar = photoUrl;
    if (!user.photos.includes(photoUrl)) {
      user.photos.push(photoUrl);
    }
    await user.save();

    res.json({
      success: true,
      message: 'Main profile photo updated successfully!',
      avatar: user.avatar,
      photos: user.photos,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error setting main avatar' });
  }
};

// @route   DELETE /api/users/:id/photos
exports.deletePhoto = async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.id && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized action' });
    }

    const { photoUrl } = req.body;
    if (!photoUrl) {
      return res.status(400).json({ success: false, message: 'Photo URL is required' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.photos = user.photos.filter(p => p !== photoUrl);

    if (user.avatar === photoUrl) {
      const defaultAvatar = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80';
      user.avatar = user.photos.length > 0 ? user.photos[0] : defaultAvatar;
    }

    await user.save();

    res.json({
      success: true,
      message: 'Photo deleted successfully!',
      photos: user.photos,
      avatar: user.avatar,
      user
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error deleting photo' });
  }
};

// @route   POST /api/users/shortlist/:id
exports.toggleShortlist = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    const targetUserId = req.params.id;

    if (currentUser._id.toString() === targetUserId) {
      return res.status(400).json({ success: false, message: 'You cannot shortlist yourself' });
    }

    const isAlreadyShortlisted = currentUser.shortlistedUsers.includes(targetUserId);

    if (isAlreadyShortlisted) {
      currentUser.shortlistedUsers.pull(targetUserId);
      await currentUser.save();
      return res.json({ success: true, message: 'Removed from shortlists', shortlisted: false });
    } else {
      currentUser.shortlistedUsers.push(targetUserId);
      await currentUser.save();
      return res.json({ success: true, message: 'Added to your shortlisted profiles!', shortlisted: true });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error toggling shortlist' });
  }
};
