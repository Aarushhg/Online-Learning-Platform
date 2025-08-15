// routes/lessonRoutes.js
const express = require('express');
const router = express.Router();
const Lesson = require('../models/Lesson');
const authenticate = require('../middleware/authMiddleware');

// Add lesson to course (admin only)
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, content, videoUrl, courseId } = req.body;

    // Ensure the logged-in user is an admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const lesson = new Lesson({ title, content, videoUrl, course: courseId });
    await lesson.save();

    res.status(201).json(lesson);
  } catch (err) {
    console.error('Lesson creation error:', err);
    res.status(500).json({ error: 'Failed to add lesson' });
  }
});

// Fetch lessons for enrolled courses
router.get('/my-lessons', authenticate, async (req, res) => {
  try {
    const enrolledCourseIds = req.user.enrolledCourses;

    const lessons = await Lesson.find({ course: { $in: enrolledCourseIds } })
      .populate('course', 'title');

    res.status(200).json(lessons);
  } catch (err) {
    console.error('Lesson fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch lessons' });
  }
});

module.exports = router;
