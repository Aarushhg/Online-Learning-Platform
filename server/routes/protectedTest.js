// routes/protectedTest.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

// @route GET /api/protected
router.get('/dashboard', authenticate, (req, res) => {
  res.json({
    message: 'Welcome to your Dashboard!',
    user: req.user,
  });
});

module.exports = router;
