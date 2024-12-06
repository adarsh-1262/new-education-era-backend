// controller/chatController.js
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { googleGenerativeApiKey } = require('../config/genai');

// Initialize Google Generative AI
const genAI = new GoogleGenerativeAI(googleGenerativeApiKey);

// Helper function for retrying requests on rate limit
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const getChatbotResponse = async (req, res) => {
  const { message } = req.body;
  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      // Create a generative model using Gemini
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

      // Call the generateContent method from Gemini API
      const result = await model.generateContent(message);

      // Get the response text from the result
      const botReply = result.response.text();

      return res.json({ response: botReply });
    } catch (error) {
      if (error.message.includes('429') && attempts < maxAttempts) {
        console.log("Rate limited by Gemini API, retrying...");
        await delay(2000); // Retry after 2 seconds
        attempts++;
      } else {
        console.error("Error with Gemini API:", error);
        return res.status(500).json({ error: "An error occurred while processing the request" });
      }
    }
  }
};

module.exports = { getChatbotResponse };
