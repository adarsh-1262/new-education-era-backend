const express = require('express');

const { protect } = require('../middlewares/expertMiddleware');
const {signupExpert, loginExpert, logOutExpert, getAllExperts, getAllExpertBookings} = require('../controllers/expertController');
const upload = require('../middlewares/multer');
const { bookExpert } = require('../controllers/expertBookingController');
const { Authprotect } = require('../middlewares/authMiddleware');


const router = express.Router();

// Routes
router.post('/signup', upload.single('profilePicture'), signupExpert);
router.post('/login', loginExpert);
router.post('/logout', logOutExpert);
router.get('/get_experts', getAllExperts)
router.post('/bookExpert',Authprotect , bookExpert)
router.get('/getExpertBookings',getAllExpertBookings)

// Example protected route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
