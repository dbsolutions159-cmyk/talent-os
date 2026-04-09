const express = require("express");
const router = express.Router();

function getDecision(score) {
  if (score >= 70) {
    return { status: "SELECTED", message: "Excellent profile 🚀" };
  } else if (score >= 50) {
    return { status: "SHORTLISTED", message: "Next round 👍" };
  } else {
    return { status: "REJECTED", message: "Not selected ❌" };
  }
}

router.post("/", (req, res) => {
  const { score } = req.body;

  if (score === undefined) {
    return res.status(400).json({ success: false });
  }

  const decision = getDecision(Number(score));

  res.json({
    success: true,
    score,
    decision
  });
});

module.exports = router;