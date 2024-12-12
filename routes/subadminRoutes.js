const express = require('express');
const { protect } = require('../middlewares/subadminMiddleware');
const { signupSubadmin, loginSubadmin, logOutSubadmin } = require('../controllers/subadminController');
const upload = require('../middlewares/multer');

const router = express.Router();

// Routes
router.post('/signup', upload.single('profilePicture'), signupSubadmin);
router.post('/login', loginSubadmin);
router.post('/logout', logOutSubadmin);

// Example protected route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
