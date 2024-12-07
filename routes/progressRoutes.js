const express = require("express");
const {
  getStudentProgress,
  updateAttendance,
  addAssignment,
  updateGrades,
} = require("../controllers/progressController");

const router = express.Router();

router.get("/:studentId", getStudentProgress);
router.patch("/:studentId/attendance", updateAttendance);
router.post("/:studentId/assignments", addAssignment);
router.patch("/:studentId/grades", updateGrades);

module.exports = router;
