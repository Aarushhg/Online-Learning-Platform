const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/authMiddleware');
const User = require('../models/User');

// Test route to check if routes are working
router.get('/test', (req, res) => {
  res.json({ message: 'User routes working' });
});

router.get('/admin/users', async (req, res) => {
  try {
    // Allow only aarush1998@gmail.com to access
   // if (req.user.email !== 'aarush1998@gmail.com') {
     // return res.status(403).json({ error: 'Access denied' });
    //}

    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    console.error('Admin fetch users error:', err);
    res.status(500).json({ error: 'Server error fetching users' });
  }
});

// ✅ Update profile route (protected)
router.patch('/profile', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const updates = req.body;

    // Prevent email/password update from here for security (optional)
    delete updates.email;
    delete updates.password;

    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'Profile updated', updatedUser: user });
  } catch (err) {
    console.error('Profile update error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ✅ NEW: Get enrolled courses for the logged-in user
router.get('/enrolled-courses', authenticate, async (req, res) => {
  try {
    console.log('Fetching enrolled courses for:', req.user._id);
    const user = await User.findById(req.user._id).populate('enrolledCourses');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    console.log('Enrolled courses:', user.enrolledCourses);
    res.json(user.enrolledCourses);
  } catch (err) {
    console.error('Fetch enrolled courses error:', err);
    res.status(500).json({ error: 'Failed to fetch enrolled courses' });
  }
});

// GET enrolled courses for current user
router.get('/my-courses', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('enrolledCourses');
    res.json(user.enrolledCourses);
  } catch (err) {
    console.error('Fetch my courses error:', err);
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

// ✅ Fetch Cart
router.get('/cart', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('cart.course'); // Make sure it populates course

    const cartCourses = user.cart.map(item => item.course);
    res.json(cartCourses);
  } catch (err) {
    console.error('Cart fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});


router.post('/add-to-cart', authenticate, async (req, res) => {
  const userId = req.user._id;
  const { courseId } = req.body;

  if (!courseId) {
    return res.status(400).json({ error: 'Course ID is required' });
  }

  try {
    const user = await User.findById(userId);

    // ✅ Check properly using the .course property
    const isAlreadyInCart = user.cart.some(
      (item) => item.course.toString() === courseId.toString()
    );

    console.log('Cart content:', user.cart);
    console.log('Incoming courseId:', courseId);

    if (isAlreadyInCart) {
      return res.status(400).json({ error: 'Course already added to cart' });
    }

    // ✅ Push in correct format
    user.cart.push({ course: courseId });
    await user.save();

    res.status(200).json({ message: 'Course added to cart' });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ error: 'Failed to add to cart' });
  }
});

// DELETE /api/users/remove-from-cart/:courseId
router.delete('/remove-from-cart/:courseId', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courseIdToRemove = req.params.courseId;

    user.cart = user.cart.filter(
      item => item.course.toString() !== courseIdToRemove.toString()
    );

    await user.save();

    res.json({ message: 'Course removed from cart' });
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ error: 'Failed to remove course from cart' });
  }
});

router.post('/clear-cart', authenticate, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = []; // ✅ Clear the cart
    await user.save();
    res.status(200).json({ message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({ error: 'Failed to clear cart' });
  }
}); 

router.post('/complete-payment', authenticate, async (req, res) => {
  const userId = req.user._id;
  const { courseIds } = req.body;

  try {
    const user = await User.findById(userId);

    // Add to enrolledCourses if not already added
    courseIds.forEach(id => {
      if (!user.enrolledCourses.includes(id)) {
        user.enrolledCourses.push(id);
      }

      // Optional: Remove from cart
      user.cart = user.cart.filter(c => c.course.toString() !== id);
    });

    await user.save();
    res.status(200).json({ message: 'Courses enrolled successfully' });
  } catch (error) {
    console.error('Payment complete error:', error);
    res.status(500).json({ error: 'Failed to update enrollment' });
  }
});

module.exports = router;
