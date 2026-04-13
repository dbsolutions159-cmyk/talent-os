require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");
const nodemailer = require("nodemailer");

const app = express();

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 5000;
const PUBLIC_PATH = path.join(__dirname, "public");

/* ================= MIDDLEWARE ================= */

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

/* ================= FRONTEND ================= */

app.use(express.static(PUBLIC_PATH));

app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "index.html"));
});

/* ================= EMAIL SETUP ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password
  },
});

/* ================= PAYMENT API ================= */

app.post("/pay", async (req, res) => {
  try {
    const { name, email, txn, amount } = req.body;

    if (!name || !email || !txn || !amount) {
      return res.json({ success: false, error: "Missing fields" });
    }

    console.log("💰 Payment Received:", req.body);

    /* ===== EMAIL TEMPLATE ===== */

    const html = `
    <div style="font-family:Arial;padding:20px;">
      <h2>✅ Payment Confirmation</h2>
      <p>Hi <b>${name}</b>,</p>

      <p>Your payment has been successfully received.</p>

      <table style="border-collapse:collapse;">
        <tr><td><b>Amount:</b></td><td>₹${amount}</td></tr>
        <tr><td><b>Transaction ID:</b></td><td>${txn}</td></tr>
      </table>

      <br>

      <div style="background:#0f172a;color:white;padding:15px;border-radius:10px;">
        <h3>Talent O-S</h3>
        <p>Powered by DB Solutions</p>
      </div>

      <p>Thank you for choosing us 🚀</p>
    </div>
    `;

    /* ===== SEND EMAIL ===== */

    await transporter.sendMail({
      from: `"Talent OS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Payment Successful - Talent OS",
      html: html,
    });

    /* ===== WHATSAPP MESSAGE LINK ===== */

    const whatsappMsg = `Payment Received ✅
Name: ${name}
Amount: ₹${amount}
TXN: ${txn}`;

    const whatsappLink = `https://wa.me/91${process.env.ADMIN_NUMBER}?text=${encodeURIComponent(
      whatsappMsg
    )}`;

    res.json({
      success: true,
      message: "Payment processed",
      whatsapp: whatsappLink,
    });
  } catch (err) {
    console.error("❌ Error:", err);
    res.json({ success: false, error: err.message });
  }
});

/* ================= TEST ================= */

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "API working ✅" });
});

/* ================= 404 ================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

/* ================= START ================= */

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🌐 Payment System LIVE");
  console.log("=================================");
});
