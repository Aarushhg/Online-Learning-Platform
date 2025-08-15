const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: String,
  author: String,
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
  title: String,
  content: String,
  author: String,
  comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);
