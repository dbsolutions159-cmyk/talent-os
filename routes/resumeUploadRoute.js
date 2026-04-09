const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");
const supabase = require("../config/supabase");
const axios = require("axios");

/* 🔥 AI ENGINE */
const { processResume } = require("../utils/scoringEngine");

/* ================= MULTER CONFIG ================= */

const uploadPath = path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
  console.log("📁 Upload folder created");
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadPath),
  filename: (req, file, cb) => {
    const cleanName = file.originalname.replace(/\s+/g, "_");
    cb(null, Date.now() + "-" + cleanName);
  }
});

const upload = multer({ storage });

/* ================= ROUTE ================= */

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    console.log("\n🚀 ===== NEW RESUME UPLOAD =====");

    /* ================= FILE CHECK ================= */

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded"
      });
    }

    const filePath = req.file.path;
    console.log("📁 File:", filePath);

    /* ================= PDF PARSE ================= */

    let resumeText = "";

    try {
      const buffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(buffer);
      resumeText = pdfData.text || "";

      console.log("🧠 Resume length:", resumeText.length);

    } catch (err) {
      console.log("⚠️ PDF parse failed:", err.message);
    }

    /* ================= 🧠 AI ANALYSIS ================= */

    console.log("🧠 Running AI Resume Analysis...");

    const result = await processResume(resumeText);

    console.log("📊 Score:", result.finalscore);
    console.log("📌 Status:", result.status);

    /* ================= 📧 EMAIL AUTOMATION ================= */

    const userEmail = "user@email.com"; // 🔥 later replace dynamic

    try {
      if (result.finalscore < 50) {
        console.log("📧 Sending rejection email...");

        await axios.post("http://localhost:5000/api/ai/send-rejection-mail", {
          email: userEmail,
          score: result.finalscore
        });
      }

      if (result.finalscore >= 50) {
        console.log("📧 Sending shortlist email...");

        await axios.post("http://localhost:5000/api/ai/send-shortlist-mail", {
          email: userEmail,
          score: result.finalscore
        });
      }
    } catch (emailErr) {
      console.error("❌ Email error:", emailErr.message);
    }

    /* ================= SAVE TO SUPABASE ================= */

    const { data, error } = await supabase
      .from("candidates")
      .insert([
        {
          name: req.file.originalname,
          skills: result.skills,
          experience: result.experience,
          resume_text: resumeText,

          score: result.ruleScore,
          finalscore: result.finalscore,
          interviewscore: 0,
          status: result.status,

          rolefit: result.roleFit || null,
          ai_analysis: result.aiAnalysis || null
        }
      ])
      .select();

    if (error) {
      console.error("❌ Supabase Error:", error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }

    const candidate = data[0];

    console.log("✅ Candidate Saved:", candidate.id);

    /* ================= RESPONSE ================= */

    return res.json({
      success: true,
      candidate,
      analysis: {
        score: result.finalscore,
        status: result.status,
        roleFit: result.roleFit,
        strengths: result.aiAnalysis?.strengths,
        weaknesses: result.aiAnalysis?.weaknesses,
        summary: result.aiAnalysis?.summary
      }
    });

  } catch (err) {
    console.error("❌ FINAL ERROR:", err);

    return res.status(500).json({
      success: false,
      error: err.message || "Upload failed"
    });
  }
});

module.exports = router;