const express = require("express");
const Enrolment = require("../models/Enrolment");
const router = express.Router();

router.post("/", async (req, res) => {
  const { studentName, parentName, email, phone, selectedClass } = req.body;

  try {
    const user = await Enrolment.findOne({email})
    if(user) {
        return res.status(400).json({ success: false, message: 'Already Enrolled' });
    }

    const enrolment = new Enrolment({ studentName, parentName, email, phone, selectedClass });
    await enrolment.save();

    res.json({ message: "Enrollment successful!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
