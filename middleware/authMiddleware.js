const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jessy_matrimony_super_secret_jwt_key_2026_tn');

      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User no longer exists' });
      }

      if (req.user.status === 'inactive') {
        return res.status(403).json({ success: false, message: 'Your account has been deactivated by Admin. Please contact support.' });
      }

      return next();
    } catch (error) {
      console.error('Auth verification error:', error.message);
      return res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

const optionalAuth = async (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'jessy_matrimony_super_secret_jwt_key_2026_tn');
      const user = await User.findById(decoded.id).select('-password');
      if (user && user.status !== 'inactive') {
        req.user = user;
      }
    } catch (error) {
      // Ignore token errors for optional auth
    }
  }
  next();
};

module.exports = { protect, optionalAuth };
