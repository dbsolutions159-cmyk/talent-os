const express = require("express");
const router = express.Router();
const axios = require("axios");

/* ================= CLEAN JSON ================= */
function extractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      return JSON.parse(match[0]);
    }
    return null;
  } catch (err) {
    return null;
  }
}

/* ================= AI CHAT ROUTE ================= */
router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        reply: "Message required",
        form: []
      });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b-instruct",
        temperature: 0.7,
        messages: [
          {
            role: "system",
            content: `
You are Zentro AI - a smart career assistant.

Always respond in strict JSON format:

{
  "reply": "Friendly helpful answer",
  "form": [
    { "label": "Field name", "type": "text" }
  ]
}

Rules:
- Guide user (like Gemini UI)
- If user confused → give suggestions
- If job → ask skills, experience
- If interview → ask preparation questions
- Keep reply short and smart
- Always return valid JSON only
`
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Zentro AI"
        }
      }
    );

    const aiText = response.data.choices[0].message.content;

    console.log("AI RAW:", aiText);

    /* ================= PARSE ================= */
    let parsed = extractJSON(aiText);

    if (!parsed) {
      return res.json({
        success: true,
        reply: "⚠️ AI format issue, try again",
        form: []
      });
    }

    /* ================= DEFAULT SAFE ================= */
    res.json({
      success: true,
      reply: parsed.reply || "No reply",
      form: Array.isArray(parsed.form) ? parsed.form : []
    });

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);

    res.status(500).json({
      success: false,
      reply: "Server error",
      form: []
    });
  }
});

module.exports = router;