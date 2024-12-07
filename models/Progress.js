const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  attendance: { type: Number, default: 0 }, // Percentage
  assignments: [
    {
      title: { type: String, required: true },
      submissionDate: { type: Date, required: true },
      grade: { type: String, default: "Not Graded" },
    },
  ],
  grades: [
    {
      subject: { type: String, required: true },
      grade: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model("Progress", progressSchema);
