const express = require("express");
const {
  getAllSchedules,
  createSchedule,
  updateSchedule,
  deleteSchedule,
} = require("../controllers/scheduleController");
const validateSchedule = require("../middlewares/validateSchedule");

const router = express.Router();

// Route to get all schedules
router.get("/", getAllSchedules);

// Route to create a new schedule
router.post("/", validateSchedule, createSchedule);

// Route to update a schedule
router.put("/:id", validateSchedule, updateSchedule);

// Route to delete a schedule
router.delete("/:id", deleteSchedule);

module.exports = router;
