const express = require("express");
const router = express.Router();

const scoreCandidate = require("../services/aiScoring");
const supabase = require("../config/supabase");

// 🚀 Score all candidates
router.post("/score", async (req, res) => {
  try {
    const job = req.body;

    // DB se candidates lao
    const { data: candidates, error } = await supabase
      .from("candidates")
      .select("*");

    if (error) throw error;

    const results = [];

    for (const candidate of candidates) {
      const scoreData = await scoreCandidate(candidate, job);

      if (scoreData) {
        results.push({
          ...candidate,
          ...scoreData
        });
      }
    }

    // Sort by score
    results.sort((a, b) => b.score - a.score);

    res.json({
      success: true,
      topCandidate: results[0],
      allResults: results
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      error: "Scoring failed"
    });
  }
});

module.exports = router;