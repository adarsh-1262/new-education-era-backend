const express = require("express");
const QRCode = require("qrcode");
const Student = require("../models/Student");

const router = express.Router();

// Generate QR Code for a student
router.get("/generate-qr/:id", async (req, res) => {
  try {
    const studentId = req.params.id;
    const student = await Student.findOne({ studentId });

    if (!student) return res.status(404).json({ message: "Student not found" });

    const qrCodeData = await QRCode.toDataURL(studentId);
    res.json({ qrCode: qrCodeData });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
