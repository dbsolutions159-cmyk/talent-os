const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const { v4: uuidv4 } = require("uuid");

const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

/* =========================
   EMAIL CONFIG (GMAIL)
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* =========================
   APPLY API
========================= */
router.post("/", async (req, res) => {
  try {
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        error: "All fields required"
      });
    }

    const token = uuidv4();

    /* SAVE TO DB */
    const { error } = await supabase
      .from("applications")
      .insert([
        {
          name,
          email,
          role,
          token,
          status: "Applied"
        }
      ]);

    if (error) throw error;

    /* EMAIL SEND */
    const link = `http://localhost:5000/assessment.html?token=${token}`;

    await transporter.sendMail({
      from: `"Zentro AI" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Assessment Link",
      html: `
        <h3>Hello ${name},</h3>
        <p>Your application is received.</p>
        <p><b>Start Assessment:</b></p>
        <a href="${link}">${link}</a>
      `
    });

    res.json({
      success: true,
      message: "Application submitted & email sent"
    });

  } catch (err) {
    console.log("❌ APPLY ERROR:", err.message);
    res.status(500).json({
      error: "Server error"
    });
  }
});

module.exports = router;