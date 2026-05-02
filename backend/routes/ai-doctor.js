const express = require('express');
const router = express.Router();
require('dotenv').config();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// POST /api/ai-doctor/consult
router.post('/consult', async (req, res) => {
  try {
    const { disease, symptoms, medicalHistory } = req.body;

    if (!disease || !symptoms) {
      return res.status(400).json({ error: 'Disease and symptoms are required' });
    }

    if (!GROQ_API_KEY) {
      return res.status(500).json({ error: 'Groq API key not configured' });
    }

    const prompt = `You are a helpful medical assistant AI. A user is reporting the following health concern:

Disease/Condition: ${disease}
Symptoms: ${symptoms}
${medicalHistory ? `Medical History: ${medicalHistory}` : ''}

Please provide:
1. A brief analysis of these symptoms
2. Possible conditions this could indicate
3. Recommended home care measures
4. When to seek professional medical help (IMPORTANT)
5. Suggested next steps

IMPORTANT: Always remind the user to consult a professional doctor for proper diagnosis and treatment. This is for informational purposes only.`;

    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('Groq API error:', error);
      return res.status(500).json({ error: 'Failed to get AI consultation', details: error });
    }

    const data = await response.json();
    const consultation = data.choices[0].message.content;

    res.json({
      disease,
      symptoms,
      consultation,
      disclaimer: '⚠️ This is an AI-powered informational assistant and NOT a replacement for professional medical advice. Always consult a qualified healthcare provider.'
    });
  } catch (err) {
    console.error('AI Doctor error:', err);
    res.status(500).json({ error: 'Consultation failed', message: err.message });
  }
});

module.exports = router;
