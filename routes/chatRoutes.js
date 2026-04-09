const express = require("express");
const router = express.Router();

// ✅ OpenRouter AI service
const { analyzeResumeAI } = require("../services/aiService");

/* ================= CHAT ================= */

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        error: "Message is required"
      });
    }

    // 🔥 AI Prompt
    const prompt = `
You are an AI career assistant.

User message:
${message}

Reply in a helpful, short and professional way.
`;

    const aiResult = await analyzeResumeAI(prompt);

    // 🔥 Extract response safely
    let reply = "";

    if (typeof aiResult === "string") {
      reply = aiResult;
    } else if (aiResult?.message) {
      reply = aiResult.message;
    } else {
      reply = "I'm here to help you with your career 🚀";
    }

    res.json({
      success: true,
      reply
    });

  } catch (err) {
    console.error("❌ Chat Error:", err.message);

    res.json({
      success: true,
      reply: "AI is busy right now. Try again later."
    });
  }
});

module.exports = router;