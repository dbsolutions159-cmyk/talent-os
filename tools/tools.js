const axios = require("axios");

const BACKEND_URL = "http://localhost:5000";
const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";

/* ================= HELPERS ================= */

function extractSkill(message = "", context = {}) {
  const msg = message.toLowerCase();

  if (msg.includes("react")) return "react developer";
  if (msg.includes("node")) return "node developer";
  if (msg.includes("python")) return "python developer";
  if (msg.includes("java")) return "java developer";

  if (context.skill) return context.skill + " developer";

  return "developer";
}

function detectFilters(message = "", context = {}) {
  const msg = message.toLowerCase();

  return {
    remote: msg.includes("remote") || context.remote,
    fresher: msg.includes("fresher") || msg.includes("entry level")
  };
}

/* ================= GPT CALL ================= */

async function callGPT(system, user) {
  try {
    const res = await axios.post(
      OPENROUTER_API,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return res.data.choices[0].message.content;

  } catch (err) {
    console.error("❌ GPT Error:", err.message);
    return "⚠️ AI failed. Try again.";
  }
}

/* ================= TOOLS ================= */

const tools = {

  /* ================= JOB SEARCH ================= */

  job_search: async (userId, memory, data = {}) => {
    try {
      console.log("🔥 JOB SEARCH");

      const message = data.message || "";

      const skill = extractSkill(message, memory.context);
      const filters = detectFilters(message, memory.context);

      let query = skill;

      if (filters.remote) query = "remote " + query;
      if (filters.fresher) query = "junior " + query;

      const res = await axios.get(
        `${BACKEND_URL}/api/jobs-api?skill=${encodeURIComponent(query)}`
      );

      const jobs = res.data.jobs || [];

      if (!jobs.length) {
        return "❌ No jobs found. Try another skill.";
      }

      memory.lastJobs = jobs;
      memory.lastQuery = query;

      let output = "🔥 Top jobs for you:\n\n";

      jobs.slice(0, 5).forEach((job, i) => {
        output += `${i + 1}️⃣ ${job.title}\n`;
        output += `🏢 ${job.company}\n`;
        output += `📍 ${job.location}\n`;
        output += `🔗 ${job.link}\n\n`;
      });

      output += "💡 Tip: Ask for remote / fresher jobs";

      return output;

    } catch (err) {
      console.error(err.message);
      return "⚠️ Failed to fetch jobs.";
    }
  },

  /* ================= RESUME MATCH ================= */

  resume_match: async (userId, memory) => {
    try {
      console.log("📄 RESUME MATCH");

      const candidate = memory.lastCandidate;

      if (!candidate) {
        return "❌ Please upload your resume first.";
      }

      const skill = candidate.skills?.[0] || "developer";

      const res = await axios.get(
        `${BACKEND_URL}/api/jobs-api?skill=${encodeURIComponent(skill)}`
      );

      const jobs = res.data.jobs || [];

      if (!jobs.length) {
        return "❌ No matching jobs found.";
      }

      let output = "🎯 Jobs based on your resume:\n\n";

      jobs.slice(0, 5).forEach((job, i) => {
        output += `${i + 1}. ${job.title} (${job.company})\n`;
      });

      return output;

    } catch (err) {
      console.error(err.message);
      return "⚠️ Resume match failed.";
    }
  },

  /* ================= EMAIL WRITER ================= */

  email_writer: async (userId, memory, data = {}) => {
    return await callGPT(
      "Write a professional email for job, HR, or formal communication",
      data.message
    );
  },

  /* ================= APPLICATION WRITER ================= */

  application_writer: async (userId, memory, data = {}) => {
    return await callGPT(
      "Write a formal leave or job application in professional tone",
      data.message
    );
  },

  /* ================= RESUME BUILDER ================= */

  resume_builder: async (userId, memory, data = {}) => {
    return await callGPT(
      "Create a professional ATS-friendly resume with sections: summary, skills, experience, projects",
      data.message
    );
  },

  /* ================= INTERVIEW PREP ================= */

  interview: async (userId, memory, data = {}) => {
    return await callGPT(
      "Act as an interviewer and ask relevant job interview questions",
      data.message || "Start interview"
    );
  },

  /* ================= QUESTION ANSWER ================= */

  ask_question: async (userId, memory, data = {}) => {
    return await callGPT(
      "Answer interview question professionally with explanation",
      data.message
    );
  },

  /* ================= SCHEDULE ================= */

  schedule_assessment: async (userId, memory, data = {}) => {
    try {
      await axios.post(`${BACKEND_URL}/api/ai/send-schedule-mail`, {
        email: "user@email.com",
        date: data.date || "Tomorrow",
        time: data.time || "10:00 AM"
      });

      memory.scheduled = true;

      return "📅 Assessment scheduled successfully! Check your email.";

    } catch (err) {
      return "⚠️ Scheduling failed.";
    }
  },

  /* ================= IMAGE ================= */

  image_generate: async () => {
    return "🎨 Image generation ready (connect API next step)";
  },

  /* ================= GENERAL ================= */

  general_help: async () => {
    return `
💬 I can help you with:
- Job search 🔍
- Resume building 📄
- Email writing ✉️
- Applications 📝
- Interview prep 🎯

👉 Just tell me what you need 🚀
`;
  }

};

module.exports = tools;