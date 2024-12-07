const Schedule = require("../models/Schedule");

// Get all schedules
exports.getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.find();
    res.json(schedules);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new schedule
exports.createSchedule = async (req, res) => {
  const { subject, startTime, endTime } = req.body;

  try {
    const newSchedule = new Schedule({ subject, startTime, endTime });
    await newSchedule.save();
    res.status(201).json(newSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update a schedule
exports.updateSchedule = async (req, res) => {
  const { id } = req.params;
  const { subject, startTime, endTime } = req.body;

  try {
    const updatedSchedule = await Schedule.findByIdAndUpdate(
      id,
      { subject, startTime, endTime },
      { new: true }
    );

    if (!updatedSchedule) {
      return res.status(404).json({ error: "Schedule not found." });
    }

    res.json(updatedSchedule);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a schedule
exports.deleteSchedule = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedSchedule = await Schedule.findByIdAndDelete(id);

    if (!deletedSchedule) {
      return res.status(404).json({ error: "Schedule not found." });
    }

    res.json({ message: "Schedule deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
