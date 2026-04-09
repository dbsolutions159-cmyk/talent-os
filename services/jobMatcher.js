const fs = require("fs");
const path = require("path");

const JOB_DB = path.join(__dirname, "../db.json");

function matchJobs(userSkills) {
  try {
    const data = JSON.parse(fs.readFileSync(JOB_DB, "utf-8"));

    const jobs = data.jobs || [];

    const matches = jobs.filter(job => {
      return job.skills.some(skill =>
        userSkills.toLowerCase().includes(skill.toLowerCase())
      );
    });

    return matches.slice(0, 3); // top 3 jobs

  } catch (err) {
    console.error("Job match error:", err.message);
    return [];
  }
}

module.exports = { matchJobs };