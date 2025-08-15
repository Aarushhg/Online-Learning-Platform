  const express = require('express');
  const router = express.Router();
  const Course = require('../models/Course');
  const authenticate = require('../middleware/authMiddleware');
  const multer = require('multer');
  const path = require('path');

  // @route   GET /api/courses
  // @desc    Get all courses with optional search, category filter, and pagination
  router.get('/', async (req, res) => {
    try {
      const { search = '', category, page = 1, limit = 6 } = req.query;

      const query = {};

      if (search) {
        query.title = { $regex: search, $options: 'i' };
      }

      if (category) {
        query.category = category;
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [courses, total] = await Promise.all([
        Course.find(query)
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(parseInt(limit)),
        Course.countDocuments(query)
      ]);

      res.json({
        courses,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      });
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  // @route GET /api/courses/student-content
  // @desc Get lessons, live classes, and notifications from enrolled courses
  // @access Private
  router.get('/student-content', authenticate, async (req, res) => {
    try {
      const enrolledCourses = req.user.enrolledCourses || [];

      if (!Array.isArray(enrolledCourses) || enrolledCourses.length === 0) {
        return res.json({ lessons: [], liveClasses: [], notifications: [] });
      }

      const courses = await Course.find({ _id: { $in: enrolledCourses } });

      const lessons = [];
      const liveClasses = [];
      const notifications = [];

      for (let course of courses) {
        if (Array.isArray(course.lessons)) {
          lessons.push(...course.lessons.map(link => ({ title: course.title, videoUrl: link })));
        }
        if (Array.isArray(course.liveClasses)) {
          liveClasses.push(...course.liveClasses.map(link => ({
            title: course.title,
            instructor: course.instructor.name || '',
            link: link,
            startTime: new Date()
          })));
        }
        if (Array.isArray(course.notifications)) {
          notifications.push(...course.notifications.map(msg => ({
            title: course.title,
            message: msg,
            createdAt: course.createdAt
          })));
        }
      }

      res.json({ lessons, liveClasses, notifications });
    } catch (err) {
      console.error('Error fetching student content:', err);
      res.status(500).json({ error: 'Failed to load content' });
    }
  });

  router.get('/instructor', authenticate, async (req, res) => {
    try {
      const courses = await Course.find({ instructor: req.user._id });
      res.json(courses);
    } catch (err) {
      console.error('Fetch instructor courses error:', err);
      res.status(500).json({ error: 'Failed to fetch courses' });
    }
  });

  router.get('/:id', async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });
      res.json(course);
    } catch (err) {
      res.status(500).json({ error: 'Failed to fetch course' });
    }
  });

  // ✅ Updated PUT route to REPLACE instead of APPEND
  router.put('/:id', authenticate, async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });

      if (!course.instructor) {
        const defaultInstructorId = '64f8e7e8ad912f001231abcd';
        course.instructor = defaultInstructorId;
      }

      const updatableFields = ['title', 'description', 'price', 'image', 'category'];
      for (let field of updatableFields) {
        if (req.body[field] !== undefined) {
          course[field] = req.body[field];
        }
      }

      // ✅ Append new lessons
      if (Array.isArray(req.body.lessons)) {
        const newLessons = req.body.lessons.filter(Boolean);
        course.lessons.push(...newLessons);
      }

      // ✅ Append new live classes
      if (Array.isArray(req.body.liveClasses)) {
        const newLiveClasses = req.body.liveClasses.filter(Boolean);
        course.liveClasses.push(...newLiveClasses);
      }

      // ✅ Append new notifications
      if (Array.isArray(req.body.notifications)) {
        const newNotifications = req.body.notifications.filter(Boolean);
        course.notifications.push(...newNotifications);
      }

      await course.save();
      res.json({ message: 'Course updated successfully', course });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({ error: 'Failed to update course' });
    }
  });

  router.delete('/:id', authenticate, async (req, res) => {
    try {
      const course = await Course.findById(req.params.id);
      if (!course) return res.status(404).json({ error: 'Course not found' });

      if (course.instructor.toString() !== req.user._id.toString() && req.user.email !== 'aarush1998@gmail.com') {
        return res.status(403).json({ error: 'Not authorized to delete this course' });
      }

      await Course.findByIdAndDelete(req.params.id);
      res.json({ message: 'Course deleted successfully' });
    } catch (err) {
      console.error('Delete error:', err);
      res.status(500).json({ error: 'Failed to delete course' });
    }
  });

  // Configure Multer storage
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
      const uniqueName = Date.now() + '-' + file.originalname;
      cb(null, uniqueName);
    }
  });

  const upload = multer({ storage });

  // POST /api/courses
router.post('/', authenticate, async (req, res) => {
  try {
    const { title, description, price, category, lessons, image} = req.body;

    // Create a new course using the provided image URL
    const newCourse = new Course({
      title,
      description,
      category,
      price,
      instructor: req.user._id,
      lessons: lessons ? JSON.parse(lessons) : [],
      image: image // directly assign the image URL here
    });

    // Save the new course to the database
    const saved = await newCourse.save();
    res.status(201).json(saved); // Respond with the saved course data
  } catch (err) {
    console.error('Create course error:', err);
    res.status(400).json({ error: 'Failed to create course' });
  }
});


  router.patch('/:courseId/remove-item', authenticate, async (req, res) => {
    try {
      const { type, index } = req.body;
      const course = await Course.findById(req.params.courseId);

      if (!course) return res.status(404).json({ error: 'Course not found' });

      if (
        course.instructor.toString() !== req.user._id.toString() &&
        req.user.email !== 'aarush1998@gmail.com'
      ) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      if (!['lessons', 'liveClasses', 'notifications'].includes(type)) {
        return res.status(400).json({ error: 'Invalid content type' });
      }

      if (typeof index !== 'number' || index < 0 || index >= course[type].length) {
        return res.status(400).json({ error: 'Invalid index' });
      }

      course[type].splice(index, 1);

      await course.save();

      res.json({ message: `${type} item removed`, course });
    } catch (err) {
      console.error('Error removing course item:', err);
      res.status(500).json({ error: 'Failed to remove item' });
    }
  });

  module.exports = router;
