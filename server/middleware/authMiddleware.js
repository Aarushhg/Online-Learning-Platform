// authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key'; // ✅ Uses env variable if available

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // ✅ Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // ✅ Attach user object (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    // ❌ If user not found (possible deleted account)
    if (!req.user) {
      return res.status(404).json({ error: 'User not found' });
    }

    next(); // ✅ Allow request to proceed
  } catch (err) {
    console.error('JWT auth error:', err.message); // Optional: log for debugging
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authenticate;
