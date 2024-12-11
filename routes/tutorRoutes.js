const express = require('express');

const { protect } = require('../middlewares/tutorMiddleware');
const { signupTutor, loginTutor, logOutTutor } = require('../controllers/tutorController');

const router = express.Router();

// Routes
router.post('/signup', signupTutor);
router.post('/login', loginTutor);
router.post('/logout', logOutTutor);


// Example protected route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
