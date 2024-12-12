const express = require('express');
const { signupUser, loginUser, logOutUser, getRole, studentData } = require('../controllers/authController');
const { Authprotect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/multer');

const router = express.Router();

// Routes
router.post('/signup', upload.single('profilePicture'),  signupUser);
router.post('/login', loginUser);
router.post('/logout', logOutUser);
router.get('/getRole', Authprotect ,getRole)
router.get('/studentData',Authprotect, studentData);

// Example protected route
router.get('/profile', Authprotect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
