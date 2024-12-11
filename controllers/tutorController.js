const ConsultationBooking = require('../models/ConsultationBooking');
const Tutor = require('../models/Tutor');
const uploadOnCLoudinary = require('../utils/cloudinary');
const generateToken = require('../utils/generateToken');
const sendEmail = require('../utils/sendingEmail');

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

  console.log('req ',req.body)
  // Input validation
  if (!username || !email || !password || !userType || !phone || !subject || !experienceYears) {
    return res.status(400).json({ success: false, message: 'All fields are required!' });
  }

  try {

    if (!req.file) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }

    // Check if user already exists
    const existingUser = await Tutor.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists!' });
    }

    const profilePath = req.file?.path
    if (!profilePath) {
      return res.status(400).json({ message: "File upload failed. Please try again." });
    }

    const profile = await uploadOnCLoudinary(profilePath)

    // Create new expert
    const tutor = await Tutor.create({ username, email, password, userType, phone, subject, experienceYears, profilePicture: profile.url, });

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

const getAllTutors = async(req, res) => {
  try {
    const tutors = await Tutor.find({})
    res.status(200).json({ success: true, data: tutors })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

const bookTutor = async (req, res) => {
  try {
    const { tutorId } = req.body; // Expecting tutorId and userId from frontend

    // Validate input
    if (!tutorId) {
      return res.status(400).json({ error: "tutorId is required" });
    }

    const userId = req.user._id;
    const userName = req.user.username
    const userEmail = req.user.email
    console.log("user ", userId);
    console.log("email ",userEmail, userName)

    // Find the tutor by ID
    const tutor = await Tutor.findById(tutorId);

    if (!tutor) {
      return res.status(404).json({ error: "Tutor not found" });
    }

    // Add the userId to totalBookings array if not already present
    if (tutor.totalBookings.includes(userId)) {
      return res.status(201).json({ success: true, message: `${tutor.username} is booked already` });
    }

    const studentMessage = 
        `Dear ${userName},

        Thank you for booking with us! Here are the details of your appointment:
        Tutor Name: ${tutor.username}

        We look forward to serving you!

        Best regards,  
        EduHub`;

        const tutorMessage = 
        `Dear ${tutor.username},

        You have a new booking! Here are the details:

        Student Name: ${userName}
        Student Email: ${userEmail}

        Please prepare for your session accordingly.

        Best regards,  
        EduHub`;


    tutor.totalBookings.push(userId);

    console.log("sending email")
        try {
            const sendToStudent = await sendEmail(userEmail, studentMessage);
            const sendToExpert = await sendEmail(tutor.email, tutorMessage);
        } catch (error) {
            console.log("error while sending emails ",error)
            return res.status(500).json({ success: false, message: 'Error while sending email' });
        }

    // Save the updated tutor document
    await tutor.save();
    console.log("bbokings ",tutor.totalBookings)
    res.status(200).json({
      success: true,
      message: `${tutor.username} is booked successfully`,
    });
  } catch (error) {
    console.error("Error updating bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// get expert bookigns
const getAllTutorBookings = async (req, res) => {
  try {
    const expertBookings = await ConsultationBooking.find({})
    res.status(200).json({ success: true, data: expertBookings })
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
}

module.exports = { signupTutor, loginTutor, logOutTutor, getAllTutors, bookTutor, getAllTutorBookings };
