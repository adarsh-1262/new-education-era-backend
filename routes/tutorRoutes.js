const express = require('express');

const { protect } = require('../middlewares/tutorMiddleware');
const { signupTutor, loginTutor, logOutTutor, getAllTutors, bookTutor } = require('../controllers/tutorController');
const upload = require('../middlewares/multer');
const { Authprotect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Routes
router.post('/signup', upload.single('profilePicture'), signupTutor);
router.post('/login', loginTutor);
router.post('/logout', logOutTutor);
router.get('/getTutors', getAllTutors)
router.post('/bookTutor', Authprotect, bookTutor)


// Example protected route
router.get('/profile', protect, (req, res) => {
  res.status(200).json({ message: `Welcome, ${req.user.username}!` });
});

module.exports = router;
