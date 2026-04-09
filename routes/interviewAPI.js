const express = require("express");
const router = express.Router();

const { generateQuestion, evaluateAnswer } = require("../services/interviewAI");

/* ================= START INTERVIEW ================= */

router.get("/start", async (req, res) => {
  try {
    const role = req.query.role || "customer support";

    // AI Question
    const question = await generateQuestion(role);

    if (!question) {
      return res.status(500).json({
        success: false,
        error: "Question generation failed"
      });
    }

    return res.json({
      success: true,
      role,
      question
    });

  } catch (err) {
    console.error("❌ Start Interview Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
});

/* ================= SUBMIT ANSWER ================= */

router.post("/answer", async (req, res) => {
  try {
    const { question, answer, trustScore = 100 } = req.body;

    // 🔒 Validation
    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        error: "Question & Answer required"
      });
    }

    // 🤖 AI Evaluation
    const evaluation = await evaluateAnswer(question, answer);

    // 🧠 Score Extraction (safe)
    let score = 5;

    if (evaluation && typeof evaluation === "string") {
      const match = evaluation.match(/(\d+)/);
      if (match) {
        score = parseInt(match[1]);
      }
    }

    // 🔥 FINAL VERDICT LOGIC
    let verdict = "Average";

    if (trustScore < 50) {
      verdict = "Rejected (Cheating Suspected)";
    } else if (score >= 8) {
      verdict = "Strong Candidate";
    } else if (score >= 6) {
      verdict = "Good Candidate";
    } else {
      verdict = "Weak Candidate";
    }

    return res.json({
      success: true,
      evaluation,
      score,
      trustScore,
      verdict
    });

  } catch (err) {
    console.error("❌ Evaluation Error:", err.message);

    return res.status(500).json({
      success: false,
      error: "Evaluation failed"
    });
  }
});

/* ================= MULTI QUESTION (ADVANCED) ================= */

router.get("/next", async (req, res) => {
  try {
    const role = req.query.role || "customer support";

    const question = await generateQuestion(role);

    return res.json({
      success: true,
      question
    });

  } catch (err) {
    return res.status(500).json({
      success: false
    });
  }
});

/* ================= FINAL RESULT ================= */

router.post("/final", async (req, res) => {
  try {
    const { scores = [], trustScore = 100 } = req.body;

    if (!Array.isArray(scores) || scores.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Scores required"
      });
    }

    const avgScore =
      scores.reduce((a, b) => a + b, 0) / scores.length;

    let finalResult = "Rejected";

    if (trustScore < 50) {
      finalResult = "Rejected (Cheating)";
    } else if (avgScore >= 8) {
      finalResult = "Selected";
    } else if (avgScore >= 6) {
      finalResult = "Hold";
    }

    return res.json({
      success: true,
      avgScore,
      trustScore,
      finalResult
    });

  } catch (err) {
    console.error("❌ Final Error:", err.message);

    return res.status(500).json({
      success: false
    });
  }
});

/* ================= HEALTH ================= */

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Interview API working"
  });
});

module.exports = router;