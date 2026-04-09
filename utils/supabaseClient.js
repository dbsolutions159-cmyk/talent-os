const axios = require("axios");

const GROK_API_KEY = process.env.GROK_API_KEY;

async function askGemini(prompt) {
  try {
    const response = await axios.post(
      "https://api.x.ai/v1/chat/completions",
      {
        model: "grok-2-latest", // ✅ FIXED MODEL
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${GROK_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("❌ Grok Error:", error.response?.data || error.message);
    return "AI not responding properly";
  }
}

module.exports = { askGemini };