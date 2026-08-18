const Interest = require('../models/Interest');
const User = require('../models/User');

// @route   POST /api/interests
exports.sendInterest = async (req, res) => {
  try {
    const { receiverId, message } = req.body;
    const senderId = req.user._id;

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ success: false, message: 'You cannot send interest to yourself' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ success: false, message: 'Target profile not found' });
    }

    // Check existing interest
    let existingInterest = await Interest.findOne({ sender: senderId, receiver: receiverId });
    if (existingInterest) {
      if (existingInterest.status === 'cancelled' || existingInterest.status === 'rejected') {
        existingInterest.status = 'pending';
        existingInterest.message = message || existingInterest.message;
        await existingInterest.save();
        return res.json({ success: true, message: 'Interest re-sent successfully!', interest: existingInterest });
      }
      return res.status(400).json({ success: false, message: 'Interest request already sent to this member.' });
    }

    const newInterest = await Interest.create({
      sender: senderId,
      receiver: receiverId,
      message: message || 'Hi, I am interested in your profile on Jessy Matrimony and would like to connect.'
    });

    res.status(201).json({
      success: true,
      message: 'Interest sent successfully! We will notify the member.',
      interest: newInterest
    });
  } catch (error) {
    console.error('Send interest error:', error);
    res.status(500).json({ success: false, message: 'Error sending interest' });
  }
};

// @route   GET /api/interests/sent
exports.getSentInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ sender: req.user._id })
      .populate('receiver', 'name profileId gender age district occupation education avatar photos premiumMember profileVerified')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: interests.length, interests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching sent interests' });
  }
};

// @route   GET /api/interests/received
exports.getReceivedInterests = async (req, res) => {
  try {
    const interests = await Interest.find({ receiver: req.user._id })
      .populate('sender', 'name profileId gender age district occupation education avatar photos premiumMember profileVerified')
      .sort({ createdAt: -1 });

    res.json({ success: true, count: interests.length, interests });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching received interests' });
  }
};

// @route   PUT /api/interests/:id
exports.updateInterestStatus = async (req, res) => {
  try {
    const { status } = req.body; // 'accepted', 'rejected', 'cancelled'
    const interest = await Interest.findById(req.params.id);

    if (!interest) {
      return res.status(404).json({ success: false, message: 'Interest request not found' });
    }

    const userId = req.user._id.toString();

    // Check authorization: Receiver can accept/reject; Sender can cancel
    if (status === 'accepted' || status === 'rejected') {
      if (interest.receiver.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Only the recipient can accept/reject interest' });
      }
    } else if (status === 'cancelled') {
      if (interest.sender.toString() !== userId) {
        return res.status(403).json({ success: false, message: 'Only the sender can cancel interest' });
      }
    }

    interest.status = status;
    await interest.save();

    res.json({
      success: true,
      message: `Interest request status updated to ${status}`,
      interest
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error updating interest status' });
  }
};
