const express = require("express");
const router = express.Router();

let dashboard = [];

// 🔥 ADD DATA
router.post("/add", (req, res) => {

  dashboard.push(req.body);

  res.json({
    success: true
  });
});

// 🔥 GET ALL
router.get("/all", (req, res) => {
  res.json({
    success: true,
    data: dashboard
  });
});

module.exports = router;