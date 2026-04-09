const express = require("express");
const router = express.Router();

/* 🔥 FULL AI PIPELINE */
router.post("/run", async (req, res) => {
  try {
    const { input } = req.body;

    // 🔹 STEP 1: BASIC ANALYSIS
    let score = 0;

    if (input.toLowerCase().includes("react")) score += 20;
    if (input.toLowerCase().includes("node")) score += 20;
    if (input.toLowerCase().includes("javascript")) score += 20;
    if (input.toLowerCase().includes("api")) score += 20;
    if (input.length > 20) score += 20;

    // 🔹 STEP 2: DECISION
    let status = "REJECTED";
    if (score >= 70) status = "SELECTED";
    else if (score >= 50) status = "SHORTLISTED";

    // 🔹 STEP 3: INTERVIEW QUESTIONS
    const questions = [
      "Tell me about yourself",
      "Explain your main skills",
      "Why should we hire you?",
      "What is your biggest strength?"
    ];

    res.json({
      success: true,
      score,
      status,
      questions,
      message: "AI Hiring Process Completed 🚀"
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: "Pipeline failed"
    });
  }
});

module.exports = router;