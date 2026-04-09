const express = require("express");
const router = express.Router();

let dashboard = [];

router.post("/add", (req, res) => {
  const data = req.body;

  dashboard.push({
    id: Date.now(),
    ...data
  });

  res.json({ success: true });
});

router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: dashboard
  });
});

module.exports = router;