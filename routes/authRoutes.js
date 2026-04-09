const express = require("express");
const router = express.Router();

let users = [];

// SIGNUP
router.post("/signup", (req, res) => {
  const { email, password, company } = req.body;

  users.push({ email, password, company });

  res.json({ message: "Signup done" });
});

// LOGIN
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  res.json({ message: "Login success", user });
});

module.exports = router;