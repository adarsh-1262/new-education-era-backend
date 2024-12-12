const jwt = require('jsonwebtoken');
const Tutor = require('../models/Tutor');

const Tutorprotect = async (req, res, next) => {
  let token;

  // Get token from cookies
  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: 'Please Login, Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request object
    req.user = await Tutor.findById(decoded.id).select('-password');

    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed!' });
  }
};

module.exports = { Tutorprotect };
