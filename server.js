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

app.use(express.static(path.join(__dirname, "public")));

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

// CORE
const candidateRoutes = safeRequire("./routes/candidateRoutes");
const candidateDashboardRoutes = safeRequire("./routes/candidateDashboardRoutes");
const assessmentRoutes = safeRequire("./routes/assessmentRoutes");
const dashboardRoutes = safeRequire("./routes/dashboardRoutes");
const rankingRoutes = safeRequire("./routes/rankingRoutes");
const decisionRoutes = safeRequire("./routes/decisionRoutes");
const resumeUploadRoute = safeRequire("./routes/resumeUploadRoute");

// AI
const aiRoutes = safeRequire("./routes/aiRoutes");
const chatRoutes = safeRequire("./routes/chatRoutes");
const aiScoreRoute = safeRequire("./routes/aiScoreRoute");

// AI AGENT
const agentRoute = safeRequire("./routes/agentRoute");

// EMAIL
const emailRoutes = safeRequire("./routes/emailRoutes");

// JOB API
const jobApiRoute = safeRequire("./routes/jobApiRoute");

// ADVANCED
const authRoutes = safeRequire("./routes/authRoutes");
const jobRoutes = safeRequire("./routes/jobRoutes");

// MATCH
const matchRoutes = safeRequire("./routes/matchRoutes");

// RESUME + INTERVIEW
const resumeRoutes = safeRequire("./routes/resumeRoutes");
const interviewRoutes = safeRequire("./routes/interviewAPI");

// SYSTEM
const monitorRoutes = safeRequire("./routes/monitorRoutes");
const fullProcessRoutes = safeRequire("./routes/fullProcessRoutes");

// ORCHESTRATOR
const orchestratorRoute = safeRequire("./routes/orchestratorRoute");
const hrDecisionRoute = safeRequire("./routes/hrDecisionRoute");

/* ================= USE ROUTES ================= */

// CORE
if (candidateRoutes) app.use("/api/candidate", candidateRoutes);
if (candidateDashboardRoutes) app.use("/api/candidate", candidateDashboardRoutes);

if (assessmentRoutes) app.use("/api/assessment", assessmentRoutes);
if (dashboardRoutes) app.use("/api/dashboard", dashboardRoutes);
if (rankingRoutes) app.use("/api/ranking", rankingRoutes);
if (decisionRoutes) app.use("/api/decision", decisionRoutes);

if (resumeUploadRoute) app.use("/api/resume", resumeUploadRoute);

// AI
if (aiRoutes) app.use("/api/ai", aiRoutes);
if (chatRoutes) app.use("/api/chat", chatRoutes);
if (aiScoreRoute) app.use("/api/ai", aiScoreRoute);

// AGENT
if (agentRoute) {
  app.use("/api/agent", agentRoute);
  console.log("🤖 AI Agent System Active");
}

// EMAIL
if (emailRoutes) {
  app.use("/api/ai", emailRoutes);
  console.log("📧 Email Automation Enabled");
}

// JOB API
if (jobApiRoute) {
  app.use("/api/jobs-api", jobApiRoute);
  console.log("💼 Jobs API Active");
}

// ORCHESTRATOR
if (orchestratorRoute) app.use("/api/ai", orchestratorRoute);

// HR
if (hrDecisionRoute) app.use("/api/hr", hrDecisionRoute);

// ADVANCED
if (authRoutes) app.use("/api/auth", authRoutes);
if (jobRoutes) app.use("/api/jobs", jobRoutes);

// MATCH
if (matchRoutes) app.use("/api/match", matchRoutes);

// RESUME + INTERVIEW
if (resumeRoutes) app.use("/api/resume", resumeRoutes);
if (interviewRoutes) app.use("/api/interview", interviewRoutes);

// FULL PIPELINE
if (fullProcessRoutes) {
  app.use("/api/process", fullProcessRoutes);
  console.log("🔥 Full AI Pipeline Connected");
}

// SYSTEM
if (monitorRoutes) app.use("/api/monitor", monitorRoutes);

/* ================= HEALTH ================= */

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/* ================= TEST ================= */

app.get("/api/test", (req, res) => {
  res.json({ message: "API working ✅" });
});

app.get("/api/agent/health", (req, res) => {
  res.json({ message: "🤖 AI Agent Running" });
});

app.get("/api/jobs-test", (req, res) => {
  res.json({ message: "💼 Jobs API Ready" });
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

const server = app.listen(PORT, () => {
  console.log("=================================");
  console.log(`🚀 Server running on port ${PORT}`);
  console.log("🤖 AI Agent Ready");
  console.log("📧 Email Automation Enabled");
  console.log("💼 Jobs Engine Running");
  console.log("=================================");
});

/* ================= GRACEFUL SHUTDOWN ================= */

process.on("SIGINT", () => {
  console.log("🛑 Server shutting down...");
  server.close(() => {
    process.exit(0);
  });
});

/* ================= CRASH HANDLING ================= */

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err.message);
});

process.on("unhandledRejection", (err) => {
  console.error("❌ Unhandled Rejection:", err);
});