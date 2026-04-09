const express = require("express");
const router = express.Router();
const Orchestrator = require("../agents/orchestrator");

const orchestrator = new Orchestrator();

router.post("/chat", async (req, res) => {
  const { userId, message } = req.body;

  const reply = await orchestrator.run(userId, message);

  res.json({
    success: true,
    reply
  });
});

module.exports = router;