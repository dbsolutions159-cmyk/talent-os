require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const morgan = require("morgan");

const app = express();

/* ================= CORE CONFIG ================= */

const PORT = process.env.PORT || 5000;
const UPLOAD_DIR = path.join(__dirname, "uploads");

/* ================= MIDDLEWARE ================= */

app.use(cors({ origin: "*" }));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

app.use(morgan("dev"));

/* ================= GLOBAL RESPONSE FORMAT ================= */

app.use((req, res, next) => {
  const oldJson = res.json;

  res.json = function (data) {
    return oldJson.call(this, {
      success: data?.success !== false,
      timestamp: new Date().toISOString(),
      ...data,
    });
  };

  next();
});

/* ================= FILE SYSTEM ================= */

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  console.log("📁 Upload folder created");
}

app.use("/uploads", express.static(UPLOAD_DIR));

/* ================= STATIC FRONTEND ================= */

const PUBLIC_PATH = path.join(__dirname, "public");

if (fs.existsSync(PUBLIC_PATH)) {
  app.use(express.static(PUBLIC_PATH));
  console.log("🌐 Frontend serving enabled");
}

/* ================= SAFE REQUIRE ================= */

function safeRequire(routePath) {
  try {
    const route = require(routePath);
    if (!route) throw new Error("Empty export");

    console.log("✅ Loaded:", routePath);
    return route;
  } catch (err) {
    console.warn("❌ Failed:", routePath);
    console.error("👉 Reason:", err.message);
    return null;
  }
}

/* ================= ROUTES ================= */

// (same as your original — untouched)
const candidateRoutes = safeRequire("./routes/candidateRoutes");
const candidateDashboardRoutes = safeRequire("./routes/candidateDashboardRoutes");
const assessmentRoutes = safeRequire("./routes/assessmentRoutes");
const dashboardRoutes = safeRequire("./routes/dashboardRoutes");
const rankingRoutes = safeRequire("./routes/rankingRoutes");
const decisionRoutes = safeRequire("./routes/decisionRoutes");
const resumeUploadRoute = safeRequire("./routes/resumeUploadRoute");

const aiRoutes = safeRequire("./routes/aiRoutes");
const chatRoutes = safeRequire("./routes/chatRoutes");
const aiScoreRoute = safeRequire("./routes/aiScoreRoute");

const agentRoute = safeRequire("./routes/agentRoute");

const emailRoutes = safeRequire("./routes/emailRoutes");
const jobApiRoute = safeRequire("./routes/jobApiRoute");

const authRoutes = safeRequire("./routes/authRoutes");
const jobRoutes = safeRequire("./routes/jobRoutes");

const matchRoutes = safeRequire("./routes/matchRoutes");

const resumeRoutes = safeRequire("./routes/resumeRoutes");
const interviewRoutes = safeRequire("./routes/interviewAPI");

const monitorRoutes = safeRequire("./routes/monitorRoutes");
const fullProcessRoutes = safeRequire("./routes/fullProcessRoutes");

const orchestratorRoute = safeRequire("./routes/orchestratorRoute");
const hrDecisionRoute = safeRequire("./routes/hrDecisionRoute");

/* ================= USE ROUTES ================= */

if (candidateRoutes) app.use("/api/candidate", candidateRoutes);
if (candidateDashboardRoutes) app.use("/api/candidate", candidateDashboardRoutes);

if (assessmentRoutes) app.use("/api/assessment", assessmentRoutes);
if (dashboardRoutes) app.use("/api/dashboard", dashboardRoutes);
if (rankingRoutes) app.use("/api/ranking", rankingRoutes);
if (decisionRoutes) app.use("/api/decision", decisionRoutes);

if (resumeUploadRoute) app.use("/api/resume", resumeUploadRoute);

if (aiRoutes) app.use("/api/ai", aiRoutes);
if (chatRoutes) app.use("/api/chat", chatRoutes);
if (aiScoreRoute) app.use("/api/ai", aiScoreRoute);

if (agentRoute) {
  app.use("/api/agent", agentRoute);
  console.log("🤖 AI Agent System Active");
}

if (emailRoutes) {
  app.use("/api/ai", emailRoutes);
  console.log("📧 Email Automation Enabled");
}

if (jobApiRoute) {
  app.use("/api/jobs-api", jobApiRoute);
  console.log("💼 Jobs API Active");
}

if (orchestratorRoute) app.use("/api/ai", orchestratorRoute);
if (hrDecisionRoute) app.use("/api/hr", hrDecisionRoute);

if (authRoutes) app.use("/api/auth", authRoutes);
if (jobRoutes) app.use("/api/jobs", jobRoutes);

if (matchRoutes) app.use("/api/match", matchRoutes);

if (resumeRoutes) app.use("/api/resume", resumeRoutes);
if (interviewRoutes) app.use("/api/interview", interviewRoutes);

if (fullProcessRoutes) {
  app.use("/api/process", fullProcessRoutes);
  console.log("🔥 Full AI Pipeline Connected");
}

if (monitorRoutes) app.use("/api/monitor", monitorRoutes);

/* ================= ROOT FIX ================= */

app.get("/", (req, res) => {
  if (fs.existsSync(path.join(PUBLIC_PATH, "index.html"))) {
    return res.sendFile(path.join(PUBLIC_PATH, "index.html"));
  }

  // fallback if no frontend
  res.send("🚀 Zentro AI Backend Running");
});

/* ================= TEST ================= */

app.get("/api/test", (req, res) => {
  res.json({ message: "API working ✅" });
});

/* ================= 404 ================= */

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.originalUrl}`,
  });
});

/* ================= ERROR ================= */

app.use((err, req, res, next) => {
  console.error("❌ Global Error:", err.stack);

  res.status(500).json({
    success: false,
    error: err.message || "Internal Server Error",
  });
});

/* ================= SERVER START ================= */

app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🌐 Mode: Production Ready");
  console.log("=================================");
});