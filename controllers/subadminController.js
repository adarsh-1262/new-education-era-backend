
const Subadmin = require('../models/Subadmin');
const uploadOnCLoudinary = require('../utils/cloudinary');
const generateToken = require('../utils/generateToken');

// Signup user
const signupSubadmin = async (req, res) => {
  const { 
    name,
    username, 
    email, 
    password, 
    userType, 
    school, 
    Class, 
    phone 
  } = req.body;

  // Input validation
  if (!name || !username || !email || !password || !userType || !school || !Class || !phone) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {

    if (!req.file) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }

    // Check if user already exists
    const existingUser = await Subadmin.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists!' });
    }

    const profilePath = req.file?.path
    if (!profilePath) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }

    const profile = await uploadOnCLoudinary(profilePath)


    // Create new Admin
    const subadmin = await Subadmin.create({ name, username, email, password, userType, school, Class, phone, profilePicture: profile.url, });

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token: generateToken(subadmin._id), // Generate and return token
    });
  } catch (error) {
    console.log("error while sign up sub admin ",error)
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// Login user
const loginSubadmin = async (req, res) => {
  const { email, password } = req.body;
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }
  try {
    // Check if user exists
    const subadmin = await Subadmin.findOne({ email });
    if (!subadmin) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    // Verify password
    const isMatch = await subadmin.matchPassword(password); // Ensure `matchPassword` is implemented in the User model
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }
    const options = {
      httpOnly: true,
      secure: true
    }
    res
      .status(200)
      .cookie("token", generateToken(subadmin._id), options)
      .json({
      success: true,
      role: subadmin.userType,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

const logOutSubadmin = async(req, res) => {
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

module.exports = { signupSubadmin, loginSubadmin, logOutSubadmin };
