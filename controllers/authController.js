const User = require('../models/User');
const uploadOnCLoudinary = require('../utils/cloudinary');
const generateToken = require('../utils/generateToken');

// Signup user
const signupUser = async (req, res) => {
  const { 
    username, 
    email, 
    password, 
    userType, 
    school, 
    Class, 
    rollNo, 
    phone 
  } = req.body;

  // Input validation
  if (!username || !email || !password || !userType || !school || !Class || !rollNo || !phone) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {

    if (!req.file) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists!' });
    }
    const existingclassOrRollno = await User.findOne({ $and: [{Class}, {rollNo}] });
    if (existingclassOrRollno) {
      return res.status(400).json({ success: false, message: 'User is already with this Roll no in this class' });
    }

    const profilePath = req.file?.path
    if (!profilePath) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }

    const profile = await uploadOnCLoudinary(profilePath)

    // Create new user
    const user = await User.create({ username, email, password, userType, school, Class, rollNo, phone, profilePicture: profile.url, });

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token: generateToken(user._id), // Generate and return token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    // Verify password
    const isMatch = await user.matchPassword(password); // Ensure `matchPassword` is implemented in the User model
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }
    
    const options = {
      httpOnly: true,
      secure: true
  }
    res
      .status(200)
      .cookie("token", generateToken(user._id), options)
      .json({
      success: true,
      user,
      message: 'Login student successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

const logOutUser = async(req, res) => {
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

const getRole = async(req, res) => {
  try {
    const user = req.user;
    return res.status(200).json({
      success: true,
      role: user.userType,
      message: "successfully get role"
    })
  } catch (error) {
    console.log("error while getting role",error)
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}
const studentData = async (req, res) => {
  try {    
    // Respond with the student data
    return res.status(200).json({
      success: true,
      data: req.user,
    });
    
  } catch (error) {
    console.error('Error while getting studentData:', error);

    // Handle server errors
    res.status(500).json({
      success: false,
      message: 'Server error. Please try again.',
    });
  }
};

module.exports = { signupUser, loginUser, logOutUser, getRole, studentData };
