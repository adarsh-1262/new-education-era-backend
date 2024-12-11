const express = require("express");
const Student = require("../models/Student");

const router = express.Router();

// Mark attendance
router.post("/mark", async (req, res) => {
  try {
    const { studentId } = req.body;

    const student = await Student.findOne({ studentId });
    if (!student) return res.status(404).json({ message: "Student not found" });

    const today = new Date().toDateString();

    // Check if attendance is already marked for today
    if (student.attendance.some((entry) => new Date(entry.date).toDateString() === today)) {
      return res.status(400).json({ message: "Attendance already marked for today." });
    }

    // Mark attendance
    student.attendance.push({ date: new Date(), status: "Present" });
    await student.save();

    res.json({ message: "Attendance marked successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
