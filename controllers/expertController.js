const ConsultationBooking = require('../models/ConsultationBooking');
const Expert = require('../models/Expert');
const uploadOnCLoudinary = require('../utils/cloudinary');
const generateToken = require('../utils/generateToken');

// Signup user
const signupExpert = async (req, res) => {
  const { 
    username,
    email,
    password,
    userType,
    phone,
    consultationField,
    experienceYears,
    description
  } = req.body;

  // Input validation
  if (!username || !email || !password || !userType || !phone || !consultationField || !experienceYears || !description) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    console.log("file info ",req.file)
    if (!req.file) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }

    // Check if user already exists
    const existingUser = await Expert.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists!' });
    }

    const profilePath = req.file?.path
    if (!profilePath) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }

    const profile = await uploadOnCLoudinary(profilePath)
    console.log("uploaded file info ",profile.url)

    // Create new expert
    const expert = await Expert.create({ 
      username, 
      email, 
      password, 
      userType, 
      phone, 
      consultationField, 
      experienceYears, 
      profilePicture: profile.url,
      description
    });

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token: generateToken(expert._id), // Generate and return token
    });
  } catch (error) {
    console.log("error while signup ",error)
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// Login user
const loginExpert = async (req, res) => {
  const { email, password } = req.body;
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    // Check if user exists
    const expert = await Expert.findOne({ email });
    if (!expert) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    // Verify password
    const isMatch = await expert.matchPassword(password); // Ensure `matchPassword` is implemented in the User model
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }
    
    const options = {
      httpOnly: true,
      secure: true
  }

    res
      .status(200)
      .cookie("token", generateToken(expert._id), options)
      .json({
      success: true,
      role: expert.userType,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

const logOutExpert = async(req, res) => {
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

// get all the experts
const getAllExperts = async (req, res) => {
  try {
    const experts = await Expert.find({})
    res.status(200).json({ success: true, data: experts })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

// get expert bookigns
const getAllExpertBookings = async (req, res) => {
  try {
    const expertBookings = await ConsultationBooking.find({})
    res.status(200).json({ success: true, data: expertBookings, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

module.exports = { signupExpert, loginExpert, logOutExpert, getAllExperts, getAllExpertBookings };
