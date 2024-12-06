const mongoose = require("mongoose");

const enrolmentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  parentName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  selectedClass: { type: String, required: true },
  status: { type: String, default: "Pending" },
});

module.exports = mongoose.model("Enrolment", enrolmentSchema);
