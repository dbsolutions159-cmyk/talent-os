const express = require("express");
const router = express.Router();

const { saveMatch, getMatches } = require("../models/matchModel");

/* ================= MATCH API ================= */

router.post("/analyze", async (req, res) => {
  try {
    const { resumeText, job } = req.body;

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "resumeText required"
      });
    }

    // 🔥 SIMPLE MATCH LOGIC (upgradeable)
    const requiredSkills = job?.requiredSkills || [
      "React",
      "Node.js",
      "MongoDB"
    ];

    const lowerText = resumeText.toLowerCase();

    const matchedSkills = requiredSkills.filter(skill =>
      lowerText.includes(skill.toLowerCase())
    );

    const missingSkills = requiredSkills.filter(
      skill => !matchedSkills.includes(skill)
    );

    const basicScore = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );

    // 🔥 AI simulated (replace later with OpenRouter)
    const aiScore = basicScore + Math.floor(Math.random() * 10);

    const finalScore = Math.min(100, Math.round((basicScore + aiScore) / 2));

    let decision = "REJECTED";
    if (finalScore >= 75) decision = "SELECTED";
    else if (finalScore >= 50) decision = "REVIEW";

    // 🔥 SAVE DATA
    saveMatch({
      resumeText,
      finalScore,
      decision,
      matchedSkills,
      missingSkills,
      basicScore,
      aiScore
    });

    res.json({
      success: true,
      basicScore,
      aiScore,
      finalScore,
      matchedSkills,
      missingSkills,
      decision
    });

  } catch (err) {
    console.error("Match Error:", err.message);

    res.status(500).json({
      success: false,
      message: "Match failed"
    });
  }
});

/* ================= GET ALL ================= */

router.get("/all", (req, res) => {
  try {
    const data = getMatches();

    res.json({
      success: true,
      count: data.length,
      candidates: data
    });

  } catch (err) {
    res.status(500).json({
      success: false
    });
  }
});

module.exports = router;