const express = require("express");
const router = express.Router();

let candidates = [];

router.post("/add", (req, res) => {
  candidates.push(req.body);

  res.json({ success: true });
});

router.get("/top", (req, res) => {
  const sorted = candidates.sort((a, b) => b.score - a.score);

  res.json({
    success: true,
    top: sorted.slice(0, 10)
  });
});

module.exports = router;