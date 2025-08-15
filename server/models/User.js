const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  role: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    default: 'student'
  },
  phone: String,
  bio: String,
  profilePic: {
    type: String,
    default: 'https://media.istockphoto.com/id/517998264/vector/male-user-icon.jpg'
  },
  otp: String,
  otpExpires: Date,

  // ✅ Properly include enrolledCourses here inside the schema
  enrolledCourses: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],

  lessonProgress: [
    {
      courseId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
      },
      completedLessons: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Lesson'
        }
      ]
    }
  ],

  completedLessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],

  cart: [
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    },
  }
]

}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
