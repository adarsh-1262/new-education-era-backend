const express = require('express');

const { protect } = require('../middlewares/expertMiddleware');
const {signupExpert, loginExpert, logOutExpert} = require('../controllers/expertController');

const router = express.Router();

// Routes
router.post('/signup', signupExpert);
router.post('/login', loginExpert);
router.post('/logout', logOutExpert);

// Example protected route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
