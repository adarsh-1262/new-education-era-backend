const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// Signup user
const signupUser = async (req, res) => {
  const { username, email, password } = req.body;

  // Input validation
  if (!username || !email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists!' });
    }

    // Create new user
    const user = await User.create({ username, email, password });

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
      message: 'Login successful',
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

module.exports = { signupUser, loginUser, logOutUser };
