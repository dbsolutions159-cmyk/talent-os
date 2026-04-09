const axios = require("axios");

const PROVIDER = process.env.AI_PROVIDER || "gemini";

// 🔥 GEMINI
const callGemini = async (prompt) => {
  const res = await axios.post(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      contents: [{ parts: [{ text: prompt }] }]
    }
  );

  return res.data.candidates[0].content.parts[0].text;
};

// 🔥 GROK (X AI - placeholder)
const callGrok = async (prompt) => {
  const res = await axios.post(
    "https://api.x.ai/v1/chat/completions",
    {
      model: "grok-beta",
      messages: [{ role: "user", content: prompt }]
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.GROK_API_KEY}`
      }
    }
  );

  return res.data.choices[0].message.content;
};

// 🔥 MAIN EXPORT
const callAI = async (prompt) => {
  if (PROVIDER === "grok") return await callGrok(prompt);
  return await callGemini(prompt);
};

module.exports = { callAI };