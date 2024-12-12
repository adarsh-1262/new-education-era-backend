const StudentComplain = require("../models/StudentComplain");


const createComplaint = async (req, res) => {
    try {
        console.log('aaya')
      const { studentName, course, className, complaintType, message } = req.body;
  
      // Validate required fields
      if (!studentName || !course || !className || !complaintType || !message) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Create a new complaint document
      const newComplaint = new StudentComplain({
        studentName: studentName,
        subject: course,
        class: className,
        complaintType: complaintType,
        message: message,
      });
  
      // Save the complaint to the database
      await newComplaint.save();
  
      res.status(201).json({ message: "Complaint submitted successfully", data: newComplaint });
    } catch (error) {
      console.error("Error saving complaint:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  };
  
  module.exports = { createComplaint };
  