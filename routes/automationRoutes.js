const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.post("/process", auth, (req, res) => {
  const { name, resumeScore, jobMatchScore, interviewScore } = req.body;

  const company = req.user.email;

  const finalScore = Math.round(
    (resumeScore + jobMatchScore + interviewScore) / 3
  );

  let aiVerdict = "Average";

  if (finalScore >= 80) aiVerdict = "Strong Candidate";
  else if (finalScore >= 60) aiVerdict = "Good Candidate";
  else aiVerdict = "Weak Candidate";

  db.prepare(`
    INSERT INTO candidates 
    (company,name,resumeScore,jobMatchScore,interviewScore,finalScore,aiVerdict)
    VALUES (?,?,?,?,?,?,?)
  `).run(company, name, resumeScore, jobMatchScore, interviewScore, finalScore, aiVerdict);

  res.json({
    success: true,
    finalScore,
    aiVerdict
  });
});

module.exports = router;