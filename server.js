require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const helmet = require("helmet");
const morgan = require("morgan");
const nodemailer = require("nodemailer");

const app = express();

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 5000;
const PUBLIC_PATH = path.join(process.cwd(), "public");

/* ================= MIDDLEWARE ================= */

app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

/* ================= FRONTEND ================= */

// serve static files
app.use(express.static(PUBLIC_PATH));

// fallback to index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(PUBLIC_PATH, "index.html"));
});

/* ================= EMAIL SYSTEM ================= */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ================= PAYMENT API ================= */

app.post("/pay", async (req, res) => {
  try {
    const { name, email, txn, amount } = req.body;

    // validation
    if (!name || !email || !txn || !amount) {
      return res.status(400).json({
        success: false,
        error: "All fields required",
      });
    }

    console.log("💰 Payment:", { name, email, txn, amount });

    /* ================= RECEIPT HTML ================= */

    const receiptHTML = `
    <div style="font-family:Arial;padding:25px;">
      <h2 style="color:#22c55e;">Payment Successful ✅</h2>

      <p>Hi <b>${name}</b>,</p>
      <p>Your subscription is now active.</p>

      <hr/>

      <table style="font-size:15px;">
        <tr><td><b>Amount:</b></td><td>₹${amount}</td></tr>
        <tr><td><b>Transaction ID:</b></td><td>${txn}</td></tr>
      </table>

      <br/>

      <div style="background:#0f172a;color:white;padding:15px;border-radius:10px;">
        <h3>Talent O-S</h3>
        <p>Powered by DB Solutions</p>
      </div>

      <p style="margin-top:20px;">We will contact you shortly.</p>
    </div>
    `;

    /* ================= SEND EMAIL ================= */

    await transporter.sendMail({
      from: `"Talent OS" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "✅ Payment Confirmed - Talent OS",
      html: receiptHTML,
    });

    /* ================= WHATSAPP LINK ================= */

    const msg = `Hi, I have completed payment.

Name: ${name}
Amount: ₹${amount}
TXN: ${txn}`;

    const whatsappLink = `https://wa.me/91${
      process.env.ADMIN_NUMBER
    }?text=${encodeURIComponent(msg)}`;

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      message: "Payment successful",
      whatsapp: whatsappLink,
    });
  } catch (error) {
    console.error("❌ ERROR:", error.message);

    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

/* ================= HEALTH CHECK ================= */

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "LIVE",
  });
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
