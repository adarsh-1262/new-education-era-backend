const express = require('express');
const { protect } = require('../middlewares/adminMiddleware');
const { signupAdmin, loginAdmin, logOutAdmin } = require('../controllers/adminController');

const router = express.Router();

// Routes
router.post('/signup', signupAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logOutAdmin);

// Example protected route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
