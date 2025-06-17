const express = require('express');
const axios = require('axios');
const router = express.Router();
const { translate } = require('../utils/translate');

require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

router.post('/', async (req, res) => {
  const { query, lang = 'en' } = req.body; // Changed default to 'en' for consistency

  if (!query) return res.status(400).json({ error: 'No input given' });

  try {
    const prompt = `As an expert agronomist, analyze this farmer's query in ${lang} language and provide:
- Problem: 
- Cause: 
- Prevention: 

Query: ${query}`;

    const response = await axios.post(GEMINI_ENDPOINT, {
      contents: [{
        role: 'user',
        parts: [{ text: prompt }]
      }]
    }, {
      timeout: 20000,
      headers: { 'Content-Type': 'application/json' }
    });

    let aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';

    // Translate only if target language is not English
    if (lang !== 'en') {
      aiText = await translate(aiText, lang);
    }

    res.json({ summary: aiText, language: lang }); // Include language in response
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({
      error: 'Processing failed',
      details: err.message
    });
  }
});

module.exports = router;