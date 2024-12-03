const express = require('express');
const { signupUser, loginUser, logOutUser } = require('../controllers/authController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logOutUser);

// Example protected route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
