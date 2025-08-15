const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Course = require('../models/Course');
const authenticate = require('../middleware/authMiddleware');

// GET all users (admin only)
router.get('/users', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Include enrolledCourses populated with course title
    const users = await User.find({}, 'name username email role enrolledCourses')
      .populate('enrolledCourses', 'title');

    res.json(users);
  } catch (err) {
    console.error('Admin fetch users error:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// GET enrolled courses for a specific user (admin only)
router.get('/user/:id/enrolled-courses', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const user = await User.findById(req.params.id).populate('enrolledCourses', 'title instructor');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ enrolledCourses: user.enrolledCourses });
  } catch (err) {
    console.error('Failed to fetch enrolled courses for user:', err);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
});

// Update course (admin only)
router.put('/course/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedCourse);
  } catch (err) {
    console.error('Admin update course error:', err);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Promote/demote user role (admin only)
router.put('/user/role/:id', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { role } = req.body;
    if (!['student', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    res.json(updatedUser);
  } catch (err) {
    console.error('Admin update user role error:', err);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// GET all courses (admin only)
router.get('/courses', authenticate, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const courses = await Course.find().populate('instructor', 'name email');
    res.json(courses);
  } catch (err) {
    console.error('Admin fetch courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// DELETE user by ID (admin only)
router.delete('/user/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// DELETE course by ID (admin only)
router.delete('/course/:id', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });
  try {
    await Course.findByIdAndDelete(req.params.id);
    res.json({ message: 'Course deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// PATCH remove an enrolled course from a user (admin only)
router.patch('/user/:id/remove-enrollment', authenticate, async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Access denied' });

  const userId = req.params.id;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'courseId is required' });
  }

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.enrolledCourses = user.enrolledCourses.filter(
      enrolledCourseId => enrolledCourseId.toString() !== courseId
    );

    await user.save();

    res.json({ message: 'Enrollment removed', enrolledCourses: user.enrolledCourses });
  } catch (err) {
    console.error('Failed to remove enrollment:', err);
    res.status(500).json({ error: 'Failed to remove enrollment' });
  }
});

module.exports = router;
