const express = require("express");
const router = express.Router();
const axios = require("axios");

/* ================= ENV ================= */

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

/* ================= ROUTE ================= */

router.get("/", async (req, res) => {
  try {
    const skill = req.query.skill || "developer";
    const location = req.query.location || "india";

    console.log("🔍 Fetching jobs for:", skill);

    /* ================= API URL ================= */

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&results_per_page=20&what=${encodeURIComponent(
      skill
    )}&where=${encodeURIComponent(location)}`;

    const response = await axios.get(url);

    const results = response.data.results || [];

    /* ================= CLEAN DATA ================= */

    const jobs = results.map((job) => ({
      title: job.title || "No title",
      company: job.company?.display_name || "Company not disclosed",
      location: job.location?.display_name || "Location not specified",
      salary:
        job.salary_min && job.salary_max
          ? `₹${job.salary_min} - ₹${job.salary_max}`
          : "Not disclosed",
      type: job.contract_type || "Full-time",
      link: job.redirect_url
    }));

    /* ================= RESPONSE ================= */

    res.json({
      success: true,
      total: jobs.length,
      jobs
    });

  } catch (err) {
    console.error("❌ Jobs API error:", err.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch jobs",
      jobs: []
    });
  }
});

module.exports = router;