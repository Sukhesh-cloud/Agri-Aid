const axios = require('axios');
require('dotenv').config();

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GOOGLE_API_KEY}`;

// Language code mapping
const LANGUAGE_MAP = {
  telugu: 'te',
  hindi: 'hi',
  english: 'en'
};

const lang_map = {'te':'Telugu', 'hi':'Hindi', 'eng':'English', 'tam':'Tamil'};
async function translate(text, targetLang = 'Telugu') {
  try {
    // Convert full language name to code if needed
    
   const langCode = LANGUAGE_MAP[targetLang.toLowerCase()] || targetLang;
    //console.log(langCode, targetLang);
    const prompt = `Translate this agricultural advice to ${langCode} (use simple words for farmers):
    
"${text}"

Rules:
1. Keep technical terms if no translation exists
2. Use simple sentence structure
3. Maintain all formatting`;

    const response = await axios.post(GEMINI_ENDPOINT, {
      contents: [{
        parts: [{ text: prompt }]
      }]
    }, {
      timeout: 15000,
      headers: { 'Content-Type': 'application/json' }
    });

    return response.data.candidates?.[0]?.content?.parts?.[0]?.text || text;
  } catch (err) {
    console.error('Translation failed:', err.message);
    return text; // Return original text
  }
}

module.exports = { translate };