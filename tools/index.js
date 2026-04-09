const { matchJobs } = require("../services/jobMatcher");

find_jobs: async (userId, memory) => {

  const skill = memory.context?.skill;

  if (!skill) {
    return "Tell me your skills first.";
  }

  const jobs = matchJobs(skill);

  if (jobs.length === 0) {
    return "No jobs found matching your skills.";
  }

  let response = "🔥 Best jobs for you:\n\n";

  jobs.forEach((job, i) => {
    response += `${i + 1}. ${job.title} (${job.company})\n`;
  });

  return response;
}