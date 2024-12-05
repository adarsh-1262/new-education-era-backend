const Tutor = require('../models/Tutor');
const generateToken = require('../utils/generateToken');

// Signup user
const signupTutor = async (req, res) => {
  const { 
    username,
    email,
    password,
    userType,
    phone,
    subject,
    experienceYears,
  } = req.body;

  // Input validation
  if (!username || !email || !password || !userType || !phone || !subject || !experienceYears) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    // Check if user already exists
    const existingUser = await Tutor.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists!' });
    }
    // Create new expert
    const tutor = await Tutor.create({ username, email, password, userType, phone, subject, experienceYears });

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token: generateToken(tutor._id), // Generate and return token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// Login user
const loginTutor = async (req, res) => {
  const { email, password } = req.body;

  // Input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    // Check if user exists
    const tutor = await Tutor.findOne({ email });
    if (!tutor) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }
    // Verify password
    const isMatch = await tutor.matchPassword(password); // Ensure `matchPassword` is implemented in the User model
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }
    
    const options = {
      httpOnly: true,
      secure: true
  }

    res
      .status(200)
      .cookie("token", generateToken(tutor._id), options)
      .json({
      success: true,
      role: tutor.userType,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

const logOutTutor = async(req, res) => {
  const options = {
    httpOnly: true,
    secure: true
  }

  return res
  .status(200)
  .clearCookie("token", options)
  .json({
    success: true,
    message: "Logged Out"
  })

}

module.exports = { signupTutor, loginTutor, logOutTutor };
