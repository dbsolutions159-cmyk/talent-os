const express = require("express");
const router = express.Router();
const db = require("../db");
const auth = require("../middleware/auth");

router.post("/update", auth, (req, res) => {
  const { name, status } = req.body;
  const company = req.user.email;

  db.prepare(`
    UPDATE candidates
    SET status=?
    WHERE name=? AND company=?
  `).run(status, name, company);

  res.json({ success: true });
});

module.exports = router;