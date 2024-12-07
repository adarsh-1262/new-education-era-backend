module.exports = (req, res, next) => {
    const { subject, startTime, endTime } = req.body;
  
    if (!subject || !startTime || !endTime) {
      return res.status(400).json({ error: "All fields (subject, startTime, endTime) are required." });
    }
  
    if (new Date(startTime) >= new Date(endTime)) {
      return res.status(400).json({ error: "Start time must be earlier than end time." });
    }
  
    next();
  };
  