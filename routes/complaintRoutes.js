const express = require('express');
const { createComplaint } = require('../controllers/studentComplain');

const router = express.Router();

// Routes
router.post('/student', createComplaint);

module.exports = router;
