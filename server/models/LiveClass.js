// models/LiveClass.js
const mongoose = require('mongoose');

const liveClassSchema = new mongoose.Schema({
  title: { type: String, required: true },
  instructor: { type: String, required: true },
  startTime: { type: Date, required: true },
  link: { type: String, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('LiveClass', liveClassSchema);
