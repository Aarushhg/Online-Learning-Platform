// routes/quizRoutes.js
const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const Quiz = require('../models/Quiz');
const User = require('../models/User');

// @route GET /api/quiz
// @desc Get quizzes for enrolled courses
// @access Private
router.get('/my-quizzes', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses');
    const enrolledCourseIds = user.enrolledCourses.map(course => course._id);

    const quizzes = await Quiz.find({ course: { $in: enrolledCourseIds } }).populate('course', 'title');

    res.status(200).json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

module.exports = router;
