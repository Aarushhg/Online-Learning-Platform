// routes/profile.js (example for Profile)
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');

router.get('/', authenticate, (req, res) => {
  res.json({
    message: 'Profile data',
    user: req.user,
  });
});

module.exports = router;
