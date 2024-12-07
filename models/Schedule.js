const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Optional: track user who created the schedule
});

module.exports = mongoose.model("Schedule", scheduleSchema);
