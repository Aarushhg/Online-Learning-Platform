const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const User = require('../models/User');
const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

// GET /api/progress
router.get('/', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses');

    if (!user) return res.status(404).json({ error: 'User not found' });

    const progressData = [];

    for (const course of user.enrolledCourses) {
      const lessons = await Lesson.find({ course: course._id });
      const completedLessons = user.completedLessons?.filter(l => 
        lessons.map(ls => ls._id.toString()).includes(l.toString())
      ) || [];

      const progressPercent = lessons.length
        ? Math.round((completedLessons.length / lessons.length) * 100)
        : 0;

      progressData.push({
        id: course._id,
        title: course.title,
        progress: progressPercent
      });
    }

    res.json(progressData);
  } catch (error) {
    console.error('Progress route error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
