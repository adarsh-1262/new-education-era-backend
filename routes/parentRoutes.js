const express = require('express');
const { protect } = require('../middlewares/parentMiddleware');
const { loginParent, signupParent, logOutParent } = require('../controllers/parentController');

const router = express.Router();

// Routes
router.post('/signup', signupParent);
router.post('/login', loginParent);
router.post('/logout', logOutParent);

// Example protected route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;