const express = require("express");
const router = express.Router();
const { uploadCourse, getAvailableCourses } = require("../controllers/courseController");

// Route to upload a new course
router.post("/upload", uploadCourse); // Use authenticateUser if authentication is needed

// Route to get all available courses
router.get("/available", getAvailableCourses);

module.exports = router;
