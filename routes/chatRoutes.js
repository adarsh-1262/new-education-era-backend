// routes/chatRoutes.js
const express = require('express');
const { getChatbotResponse } = require('../controllers/chatController');
const router = express.Router();

// Route for handling chat responses
router.post('/chat', getChatbotResponse);

module.exports = router;
