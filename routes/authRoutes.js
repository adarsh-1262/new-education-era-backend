const express = require('express');
const { signupUser, loginUser, logOutUser, getRole, studentData } = require('../controllers/authController');
const { Authprotect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes
router.post('/signup', signupUser);
router.post('/login', loginUser);
router.post('/logout', logOutUser);
router.get('/getRole', Authprotect ,getRole)
router.get('/studentData',Authprotect, studentData);

// Example protected route
router.get('/profile', Authprotect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
