const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  attendance: [
    {
      date: { type: Date, default: Date.now },
      status: { type: String, default: "Present" },
    },
  ],
});

module.exports = mongoose.model("Student", studentSchema);
