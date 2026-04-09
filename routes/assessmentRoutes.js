const express = require("express");
const router = express.Router();

const { calculateTrust } = require("../services/trustEngine");
const { analyzeResumeAI } = require("../services/aiService"); // ✅ use aiService

/* ================= START TEST ================= */

router.get("/start", async (req, res) => {
  try {
    const role = req.query.role || "developer";

    // 🔥 AI prompt for questions
    const prompt = `
Generate 5 interview questions for a ${role} role.

Return JSON format:
{
  "questions": ["q1", "q2", "q3", "q4", "q5"]
}
`;

    const aiResult = await analyzeResumeAI(prompt);

    let questions = [];

    if (aiResult && Array.isArray(aiResult.questions)) {
      questions = aiResult.questions;
    } else {
      // 🔥 fallback questions
      questions = [
        "Tell me about yourself",
        "Explain your main skills",
        "What challenges have you faced?",
        "Why should we hire you?",
        "Where do you see yourself in 2 years?"
      ];
    }

    res.json({
      success: true,
      role,
      questions
    });

  } catch (err) {
    console.error("❌ Assessment Start Error:", err.message);

    res.json({
      success: true,
      questions: [
        "Tell me about yourself",
        "Explain your skills",
        "What projects have you done?"
      ]
    });
  }
});

/* ================= SUBMIT ================= */

router.post("/submit", (req, res) => {
  try {
    const { answers, time_taken } = req.body;

    let score = 0;

    Object.values(answers || {}).forEach(ans => {
      if (ans && ans.length > 5) score += 20;
    });

    const trustData = calculateTrust({ time_taken });

    let result = "Rejected";

    if (score >= 70 && trustData.trust >= 70) result = "Selected";
    else if (score >= 50) result = "Review";

    res.json({
      success: true,
      score,
      trust: trustData.trust,
      result
    });

  } catch (err) {
    console.error("❌ Assessment Submit Error:", err.message);

    res.status(500).json({
      success: false,
      error: "Submission failed"
    });
  }
});

module.exports = router;