const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  courseName: { type: String, required: true },
  instructor: { type: String, required: true },
  time: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;
