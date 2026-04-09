const express = require("express");
const router = express.Router();
const axios = require("axios");

const APP_ID = process.env.ADZUNA_APP_ID;
const APP_KEY = process.env.ADZUNA_APP_KEY;

/* ================= FETCH JOBS ================= */

router.get("/", async (req, res) => {
  try {
    const skill = req.query.skill || "developer";
    const location = req.query.location || "india";

    const url = `https://api.adzuna.com/v1/api/jobs/in/search/1`;

    const response = await axios.get(url, {
      params: {
        app_id: APP_ID,
        app_key: APP_KEY,
        what: skill,
        where: location,
        results_per_page: 10,
      },
    });

    const jobs = response.data.results.map((job) => ({
      title: job.title,
      company: job.company?.display_name,
      location: job.location?.display_name,
      salary: job.salary_min
        ? `₹${job.salary_min} - ₹${job.salary_max}`
        : "Not disclosed",
      link: job.redirect_url,
    }));

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (err) {
    console.error("❌ Job API error:", err.message);

    res.json({
      success: false,
      error: "Failed to fetch jobs",
    });
  }
});

module.exports = router;