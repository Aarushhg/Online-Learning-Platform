const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const User = require('../models/User'); // Import User model

// Existing GET profile route (unchanged)
router.get('/', authenticate, async (req, res) => {
  try {
    const user = req.user; // comes from middleware
    res.status(200).json({
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio,
      phone: user.phone,
      profilePic: user.profilePic,
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to load profile' });
  }
});

// Setup multer storage for profile picture uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads')); // Upload folder
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    cb(null, req.user._id + '-' + Date.now() + ext);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  }
});

// NEW POST route to upload profile picture
router.post('/upload-profile-pic', authenticate, upload.single('profilePic'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = `/uploads/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePic: filePath },
      { new: true, runValidators: true }
    ).select('-password');

    res.status(200).json({
      message: 'Profile picture uploaded successfully',
      profilePic: filePath,
      user,
    });
  } catch (error) {
    console.error('Profile pic upload error:', error);
    res.status(500).json({ error: 'Failed to upload profile picture' });
  }
});

module.exports = router;
