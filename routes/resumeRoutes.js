const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const pdfParse = require("pdf-parse");

// ✅ AI SERVICE
const { analyzeResumeAI } = require("../services/aiService");

/* ================= UPLOAD CONFIG ================= */

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  }
});

const upload = multer({ storage });

/* ================= FALLBACK ================= */

function fallbackResponse() {
  return {
    status: "REVIEW",
    score: 50,
    skills: [],
    message: "AI failed"
  };
}

/* ================= PDF PARSER ================= */

async function extractText(filePath) {
  try {
    const dataBuffer = fs.readFileSync(filePath);

    // 🔥 PDF parse
    const data = await pdfParse(dataBuffer);

    return data.text || "";
  } catch (err) {
    console.error("❌ PDF Parse Error:", err.message);
    return "";
  }
}

/* ================= ROUTE ================= */

router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded"
      });
    }

    const filePath = path.join(__dirname, "..", req.file.path);

    // 🔥 STEP 1: Extract text from PDF
    const resumeText = await extractText(filePath);

    if (!resumeText || resumeText.length < 20) {
      return res.json({
        success: false,
        message: "Invalid or empty resume"
      });
    }

    // 🔥 STEP 2: AI ANALYSIS
    let aiResult = await analyzeResumeAI(resumeText);

    if (!aiResult || typeof aiResult !== "object") {
      aiResult = fallbackResponse();
    }

    // 🔥 STEP 3: FINAL FORMAT
    const finalResult = {
      status: aiResult.score >= 70 ? "SELECTED" : aiResult.score >= 50 ? "SHORTLISTED" : "REJECTED",
      score: aiResult.score || 50,
      skills: aiResult.skills || [],
      message: aiResult.message || "No feedback"
    };

    // ✅ RESPONSE
    res.json({
      success: true,
      file: req.file.filename,
      ...finalResult
    });

  } catch (err) {
    console.error("❌ Upload Error:", err.message);

    res.status(500).json({
      success: false,
      message: "Upload failed"
    });
  }
});

module.exports = router;