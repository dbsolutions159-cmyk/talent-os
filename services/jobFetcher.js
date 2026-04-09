const axios = require("axios");

/* ================= REMOTIVE ================= */

async function fetchRemotive(skill) {
  try {
    const res = await axios.get(
      `https://remotive.com/api/remote-jobs?search=${skill}`
    );

    return res.data.jobs.slice(0, 5).map(job => ({
      title: job.title,
      company: job.company_name,
      location: job.candidate_required_location,
      type: "Remote",
      url: job.url,
      source: "Remotive"
    }));

  } catch (err) {
    console.log("❌ Remotive error");
    return [];
  }
}

/* ================= ADZUNA ================= */

async function fetchAdzuna(skill) {
  try {
    const APP_ID = process.env.ADZUNA_ID;
    const APP_KEY = process.env.ADZUNA_KEY;

    const res = await axios.get(
      `https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=${APP_ID}&app_key=${APP_KEY}&what=${skill}`
    );

    return res.data.results.slice(0, 5).map(job => ({
      title: job.title,
      company: job.company.display_name,
      location: job.location.display_name,
      type: "Full-time",
      url: job.redirect_url,
      source: "Adzuna"
    }));

  } catch (err) {
    console.log("❌ Adzuna error");
    return [];
  }
}

/* ================= MAIN ================= */

async function getJobs(skill) {
  const [remotive, adzuna] = await Promise.all([
    fetchRemotive(skill),
    fetchAdzuna(skill)
  ]);

  let jobs = [...remotive, ...adzuna];

  // fallback
  if (jobs.length === 0) {
    jobs = [
      {
        title: `${skill} Developer`,
        company: "Zentro AI",
        location: "Remote",
        type: "Fallback",
        url: "#",
        source: "Internal"
      }
    ];
  }

  return jobs;
}

module.exports = { getJobs };