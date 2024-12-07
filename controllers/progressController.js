const Progress = require("../models/Progress");

// Get progress for a student
exports.getStudentProgress = async (req, res) => {
  const { studentId } = req.params;

  try {
    const progress = await Progress.findOne({ studentId }).populate("studentId", "name");
    if (!progress) return res.status(404).json({ error: "Progress not found" });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update attendance
exports.updateAttendance = async (req, res) => {
  const { studentId } = req.params;
  const { attendance } = req.body;

  try {
    const progress = await Progress.findOneAndUpdate(
      { studentId },
      { attendance },
      { new: true }
    );
    if (!progress) return res.status(404).json({ error: "Progress not found" });
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add or update assignments
exports.addAssignment = async (req, res) => {
  const { studentId } = req.params;
  const { title, submissionDate, grade } = req.body;

  try {
    const progress = await Progress.findOne({ studentId });
    if (!progress) return res.status(404).json({ error: "Progress not found" });

    progress.assignments.push({ title, submissionDate, grade });
    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add or update grades
exports.updateGrades = async (req, res) => {
  const { studentId } = req.params;
  const { subject, grade } = req.body;

  try {
    const progress = await Progress.findOne({ studentId });
    if (!progress) return res.status(404).json({ error: "Progress not found" });

    const existingGrade = progress.grades.find((g) => g.subject === subject);
    if (existingGrade) {
      existingGrade.grade = grade;
    } else {
      progress.grades.push({ subject, grade });
    }

    await progress.save();
    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
