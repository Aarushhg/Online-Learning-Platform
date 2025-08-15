const express = require('express');
const router = express.Router();
const Discussion = require('../models/Discussion');

// Get all discussions
router.get('/', async (req, res) => {
  try {
    const discussions = await Discussion.find();
    res.json(discussions);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch discussions' });
  }
});

// Post a new discussion
router.post('/', async (req, res) => {
  const { title, author } = req.body;  // ✅ changed from 'topic' to 'title'

  try {
    const newDiscussion = new Discussion({
      title,
      author: author || 'Anonymous',
      comments: []
    });

    await newDiscussion.save();
    res.status(201).json(newDiscussion);  // ✅ return created discussion
  } catch (err) {
    res.status(500).json({ error: 'Failed to create discussion' });
  }
});

// Post a comment to a discussion
router.post('/:id/comments', async (req, res) => {
  const { id } = req.params;
  const { username, text } = req.body;

  if (!text) return res.status(400).json({ error: 'Reply text is required' });

  try {
    const discussion = await Discussion.findById(id);
    if (!discussion) return res.status(404).json({ error: 'Discussion not found' });

    discussion.comments.push({ author: username || 'Anonymous', text });
    await discussion.save();

    res.json(discussion);
  } catch (err) {
    res.status(500).json({ error: 'Failed to post reply' });
  }
});

module.exports = router;
