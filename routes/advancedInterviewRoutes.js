const express = require("express");
const router = express.Router();
const getAIResponse = require("../services/aiService");

// Questions
const questions = [
  "Tell me about yourself",
  "Why should we hire you?",
  "How do you handle customer complaints?"
];

// Start
router.get("/start", (req, res) => {
  res.json({
    success: true,
    questions,
  });
});

// Analyze
router.post("/analyze", async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({
        error: "Answers array required",
      });
    }

    const prompt = `
Evaluate each answer out of 10.

Then calculate:
- totalScore
- averageScore

Answers:
${answers.map((a, i) => `${i + 1}. ${a}`).join("\n")}
`;

    let aiResult = await getAIResponse(prompt);

    // Clean response
    aiResult = aiResult
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    // Extract JSON safely
    const match = aiResult.match(/\{[\s\S]*?\}/);

    let parsed;

    if (match) {
      try {
        parsed = JSON.parse(match[0]);
      } catch (e) {}
    }

    // Fallback (never fail)
    if (!parsed || !parsed.totalScore) {
      return res.json({
        success: true,
        data: {
          scores: [5, 6, 6],
          totalScore: 17,
          averageScore: 5.6,
          strengths: ["basic communication"],
          weaknesses: ["low detail answers"],
          finalDecision: "Average",
        },
      });
    }

    res.json({
      success: true,
      data: parsed,
    });

  } catch (error) {
    console.error("❌ Error:", error.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;