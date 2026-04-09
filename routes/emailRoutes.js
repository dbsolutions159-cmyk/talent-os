const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

/* ================= MAIL CONFIG ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ================= COMMON SEND FUNCTION ================= */

async function sendMail(options) {
  try {
    await transporter.sendMail(options);
    console.log("📧 Email sent:", options.to);
    return true;
  } catch (err) {
    console.error("❌ Email error:", err.message);
    return false;
  }
}

/* ================= REJECTION ================= */

router.post("/send-rejection-mail", async (req, res) => {
  try {
    const { email, score } = req.body;

    await sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Application Update - Zentro AI",
      html: `
        <h2>Application Status</h2>
        <p><b>Score:</b> ${score}</p>
        <p>We appreciate your interest in this opportunity.</p>
        <p>Unfortunately, you were not shortlisted.</p>
        <br/>
        <p>💡 Tip: Improve your resume and try again.</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* ================= SHORTLIST ================= */

router.post("/send-shortlist-mail", async (req, res) => {
  try {
    const { email, score } = req.body;

    await sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 You are shortlisted - Zentro AI",
      html: `
        <h2>Congratulations 🎉</h2>
        <p><b>Score:</b> ${score}</p>
        <p>You are shortlisted for the next round.</p>
        <p>Please proceed to schedule your assessment.</p>
        <br/>
        <p>🚀 Best of luck!</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* ================= ASSESSMENT SCHEDULE ================= */

router.post("/send-schedule-mail", async (req, res) => {
  try {
    const { email, date, time } = req.body;

    await sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "📅 Assessment Scheduled - Zentro AI",
      html: `
        <h2>Assessment Scheduled</h2>
        <p>Your assessment is scheduled:</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
        <br/>
        <p>⏰ Please join on time.</p>
      `
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* ================= ASSESSMENT RESULT ================= */

router.post("/send-result-mail", async (req, res) => {
  try {
    const { email, result } = req.body;

    const isPass = result === "PASS";

    await sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: isPass
        ? "🎉 You Passed the Assessment"
        : "Assessment Result - Zentro AI",
      html: `
        <h2>Assessment Result</h2>
        <p>Status: <b>${result}</b></p>
        ${
          isPass
            ? "<p>🎯 You will be contacted for the next step.</p>"
            : "<p>💡 You can improve and try again.</p>"
        }
      `
    });

    res.json({ success: true });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;