// backend/routes/liveClassRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const User = require('../models/User');
const LiveClass = require('../models/LiveClass');

// GET /api/live-classes/my-classes
router.get('/my-classes', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const courseIds = user.enrolledCourses.map(course => course._id);

    const liveClasses = await LiveClass.find({ course: { $in: courseIds } });

    res.status(200).json(liveClasses);
  } catch (error) {
    console.error('Fetch live classes error:', error);
    res.status(500).json({ error: 'Failed to fetch live classes' });
  }
});

module.exports = router;
