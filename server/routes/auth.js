const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const OTP = require('../models/OTP');

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

// ==========================
// @route   POST /api/auth/send-otp
// ==========================
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: '',
      pass: ''
    }
  });

  const mailOptions = {
    from: 'LearnPro <your-email@gmail.com>',
    to: email,
    subject: 'LearnPro Email Verification OTP',
    html: `<p>Your OTP code is: <strong>${otp}</strong>. It will expire in 10 minutes.</p>`
  };

  try {
    // Delete any existing OTPs for the email
    await OTP.deleteMany({ email });

    // Save new OTP
    const newOtp = new OTP({ email, otp, expiresAt });
    await newOtp.save();

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (error) {
    console.error('OTP send error:', error);
    res.status(500).json({ error: 'Failed to send OTP. Try again.' });
  }
});

// ==========================
// @route   POST /api/auth/verify-otp
// ==========================
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  try {
    const record = await OTP.findOne({ email });

    if (!record || record.otp !== otp || record.expiresAt < new Date()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // OTP is valid — delete it
    await OTP.deleteMany({ email });

    res.status(200).json({ message: 'OTP verified successfully' });
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'Server error during OTP verification' });
  }
});


// ==========================
// @route   POST /api/auth/register
// ==========================
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      role,
      phone,
      bio,
      profilePic
    } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'Name, username, email, and password are required' });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail && existingEmail.password) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ error: 'Username already taken' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    let user = await User.findOne({ email }); // ✅ Made 'user' mutable with let

    if (user) {
      // ✅ Update the temporary OTP user
      user.name = name;
      user.username = username;
      user.password = hashedPassword;
      user.role = role || 'student'; // Default role fallback
      user.phone = phone;
      user.bio = bio;
      user.profilePic = profilePic;
    } else {
      // ✅ Create new user with default student role if not provided
      user = new User({
        name,
        username,
        email,
        password: hashedPassword,
        role: role || 'student',
        phone,
        bio,
        profilePic
      });
    }

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ error: 'Server error during registration' });
  }
});


// ==========================
// @route   POST /api/auth/login
// ==========================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ error: 'Email and password are required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ error: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        username: user.username,
        profilePic: user.profilePic
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Server error during login' });
  }
});

module.exports = router;
