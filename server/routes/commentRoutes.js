const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET all comments
router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find();
    res.json(comments); // must be an array
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});


// POST a new comment
router.post('/', async (req, res) => {
  const { username, text } = req.body;
  if (!text) return res.status(400).json({ error: 'Comment text is required' });

  try {
    const newComment = new Comment({ username: username || 'Anonymous', text });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (err) {
    console.error('Error saving comment:', err);
    res.status(500).json({ error: 'Failed to post comment' });
  }
});

module.exports = router;
