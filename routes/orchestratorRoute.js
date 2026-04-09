const express = require("express");
const router = express.Router();

const Orchestrator = require("../agents/orchestrator");
const Recruiter = require("../agents/recruiter");
const Screening = require("../agents/screening");
const Interview = require("../agents/interview");
const Decision = require("../agents/decision");
const Communication = require("../agents/communication");

router.post("/run-ai-hiring", async (req, res) => {
  try {
    const job = req.body;

    const orchestrator = new Orchestrator({
      recruiter: new Recruiter(),
      screening: new Screening(),
      interview: new Interview(),
      decision: new Decision(),
      communication: new Communication()
    });

    const result = await orchestrator.run(job);

    res.json(result);

  } catch (err) {
    res.json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;