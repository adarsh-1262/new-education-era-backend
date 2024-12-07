const Course = require("../models/Course");

// Controller for uploading a new course
const uploadCourse = async (req, res) => {
  const { courseName, instructor, time, duration, description } = req.body;

  try {
    const newCourse = new Course({
      courseName,
      instructor,
      time,
      duration,
      description,
    });

    await newCourse.save();
    res.status(201).json({ message: "Course added successfully!", newCourse });
  } catch (error) {
    res.status(400).json({ message: "Error adding course", error: error.message });
  }
};

// Controller for getting all available courses
const getAvailableCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
};

module.exports = { uploadCourse, getAvailableCourses };
