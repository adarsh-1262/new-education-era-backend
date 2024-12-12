const Parent = require('../models/Parent');
const generateToken = require('../utils/generateToken');
const uploadOnCLoudinary = require('../utils/cloudinary');

// Signup user
const signupParent = async (req, res) => {
  const { 
    username, 
    email, 
    password, 
    userType,  
    phone,
    school, 
    Class, 
    rollNo
  } = req.body;

  // Input validation
  if (!username || !email || !password || !userType || !school || !Class || !rollNo || !phone) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    console.count("aaya")
    if (!req.file) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }
    // Check if user already exists
    const existingUser = await Parent.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists!' });
    }
    const existingclassOrRollno = await Parent.findOne({ $and: [{Class}, {rollNo}] });
    if (existingclassOrRollno) {
      return res.status(400).json({ success: false, message: 'User is already with this Roll no in this class' });
    }
    console.count("aaya")
    const profilePath = req.file?.path
    if (!profilePath) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }
    console.count("aaya")
    const profile = await uploadOnCLoudinary(profilePath)
    console.count("aaya")
    // Create new user
    const parent = await Parent.create({ username, email, password, userType, school, Class, rollNo, phone, profilePicture: profile.url, });
    console.count("aaya")
    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token: generateToken(parent._id), // Generate and return token
    });
  } catch (error) {
    console.log("error while sign up parent ",error)
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// Login user
const loginParent = async (req, res) => {
  const { email, password } = req.body;
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }
  try {
    // Check if user exists
    const parent = await Parent.findOne({ email });
    if (!parent) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    // Verify password
    const isMatch = await parent.matchPassword(password); // Ensure `matchPassword` is implemented in the Parent model
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }
    
    const options = {
      httpOnly: true,
      secure: true
  }
    res
      .status(200)
      .cookie("token", generateToken(parent._id), options)
      .json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

const logOutParent = async(req, res) => {
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

module.exports = { signupParent, loginParent, logOutParent };
