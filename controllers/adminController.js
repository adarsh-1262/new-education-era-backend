const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// Signup user
const signupAdmin = async (req, res) => {
  const { 
    name,
    username, 
    email, 
    password, 
    userType, 
    school,  
    phone 
  } = req.body;

  // Input validation
  if (!name || !username || !email || !password || !userType || !school || !phone) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {
    // Check if user already exists
    const existingUser = await Admin.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists!' });
    }

    // Create new Admin
    const admin = await Admin.create({ name, username, email, password, userType, school, phone });

    res.status(201).json({
      success: true,
      message: 'Signup successful',
      token: generateToken(admin._id), // Generate and return token
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// Login user
const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  // Input validation
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }
  try {
    // Check if user exists
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'User not found!' });
    }

    // Verify password
    const isMatch = await admin.matchPassword(password); // Ensure `matchPassword` is implemented in the User model
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials!' });
    }
    const options = {
      httpOnly: true,
      secure: true
    }
    res
      .status(200)
      .cookie("token", generateToken(admin._id), options)
      .json({
      success: true,
      message: 'Login successful',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

const logOutAdmin = async(req, res) => {
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

module.exports = { signupAdmin, loginAdmin, logOutAdmin };
