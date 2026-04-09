const express = require("express");
const router = express.Router();

let users = {};

// START
router.post("/start", (req, res) => {
  const { userId } = req.body;

  users[userId] = {
    trustScore: 100,
    flags: []
  };

  res.json({ success: true });
});

// LOG
router.post("/log", (req, res) => {
  const { userId, type } = req.body;

  users[userId].flags.push(type);
  users[userId].trustScore -= 10;

  res.json(users[userId]);
});

// GET
router.get("/:userId", (req, res) => {
  res.json(users[req.params.userId]);
});

module.exports = router;