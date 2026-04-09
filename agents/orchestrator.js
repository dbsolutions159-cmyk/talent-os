const AIAgent = require("./aiAgent");
const { getAction } = require("./actionMap");
const tools = require("../tools/tools");

/* ================= MEMORY ================= */

const userMemory = {};

function getMemory(userId) {
  if (!userMemory[userId]) {
    userMemory[userId] = {
      history: [],
      context: {},
      lastCandidate: null,
      lastJobs: null,
      flow: null,
      scheduled: false
    };
  }
  return userMemory[userId];
}

class Orchestrator {

  constructor() {
    this.agent = new AIAgent();
  }

  async run(userId, message) {
    try {

      const memory = getMemory(userId);

      /* ================= SAVE USER ================= */

      memory.history.push({
        role: "user",
        content: message
      });

      /* ================= CONTEXT ================= */

      this.updateContext(memory, message);

      /* ================= AI ================= */

      const ai = await this.agent.analyze(message, memory);

      let intent = ai.intent || "GENERAL";
      let reply = ai.reply || "I'm here to help you.";
      let confidence = ai.confidence ?? 0.5;

      console.log("🧠 Intent:", intent, "| Confidence:", confidence);

      if (confidence < 0.4) intent = "GENERAL";

      let action = getAction(intent);

      if (!action || !tools[action]) {
        action = "general_help";
      }

      let finalOutput = `🤖 ${reply}\n\n`;

      /* ================= 🔥 SMART FLOW ENGINE ================= */

      switch (intent) {

        /* ================= JOB FLOW ================= */

        case "JOB_SEARCH": {

          const jobs = await tools.job_search(userId, memory, { message });
          finalOutput += jobs + "\n\n";

          memory.flow = "JOB";

          // resume match auto
          if (memory.lastCandidate) {
            finalOutput += "🧠 Matching based on your resume...\n";
            const match = await tools.resume_match(userId, memory);
            finalOutput += match + "\n\n";
          } else {
            finalOutput += "📄 Upload your resume for better results.\n";
          }

          break;
        }

        /* ================= RESUME FLOW ================= */

        case "RESUME_BUILDER": {

          const resume = await tools.resume_builder(userId, memory, { message });
          finalOutput += resume + "\n\n";

          memory.flow = "RESUME";
          memory.context.goal = "resume";

          finalOutput += "💡 Want me to find jobs for this resume?";
          break;
        }

        /* ================= EMAIL ================= */

        case "EMAIL_WRITER": {

          const email = await tools.email_writer(userId, memory, { message });
          finalOutput += email;

          memory.flow = "EMAIL";

          break;
        }

        /* ================= APPLICATION ================= */

        case "APPLICATION_WRITER": {

          const app = await tools.application_writer(userId, memory, { message });
          finalOutput += app;

          memory.flow = "APPLICATION";

          break;
        }

        /* ================= IMAGE ================= */

        case "IMAGE_GENERATE": {

          const img = await tools.image_generate(userId, memory, { message });
          finalOutput += img;

          memory.flow = "IMAGE";

          break;
        }

        /* ================= INTERVIEW ================= */

        case "INTERVIEW": {

          memory.flow = "INTERVIEW";

          finalOutput += "🎯 Starting interview preparation...\n";
          finalOutput += "👉 Tell me your role (React / HR / Data Analyst)\n";

          break;
        }

        /* ================= ASSESSMENT ================= */

        case "SCHEDULE_ASSESSMENT": {

          const res = await tools.schedule_assessment(userId, memory, { message });
          finalOutput += res;

          memory.scheduled = true;
          memory.flow = "ASSESSMENT";

          break;
        }

        /* ================= DEFAULT ================= */

        default: {

          const help = await tools.general_help();
          finalOutput += help;

          memory.flow = "GENERAL";
        }
      }

      /* ================= 🔥 AUTO NEXT STEP (MAGIC) ================= */

      finalOutput += this.smartNextStep(memory);

      /* ================= SAVE AI ================= */

      memory.history.push({
        role: "assistant",
        content: reply
      });

      if (memory.history.length > 12) {
        memory.history = memory.history.slice(-12);
      }

      return finalOutput;

    } catch (err) {
      console.error("❌ Orchestrator error:", err.message);
      return "⚠️ System error. Please try again.";
    }
  }

  /* ================= SMART NEXT STEP ================= */

  smartNextStep(memory) {

    if (memory.flow === "JOB" && !memory.lastCandidate) {
      return "\n\n👉 Upload your resume to improve job matching 📄";
    }

    if (memory.flow === "RESUME") {
      return "\n\n👉 Want me to search jobs for you? 🔍";
    }

    if (memory.lastCandidate && !memory.scheduled) {
      return "\n\n📅 You are eligible. Schedule your assessment now.";
    }

    if (memory.scheduled) {
      return "\n\n🚀 You're all set! Prepare for assessment.";
    }

    return "";
  }

  /* ================= CONTEXT BUILDER ================= */

  updateContext(memory, message) {
    const msg = message.toLowerCase();

    if (msg.includes("react")) memory.context.skill = "react";
    if (msg.includes("node")) memory.context.skill = "node";
    if (msg.includes("python")) memory.context.skill = "python";
    if (msg.includes("java")) memory.context.skill = "java";

    if (msg.includes("job")) memory.context.goal = "job";
    if (msg.includes("resume")) memory.context.goal = "resume";
    if (msg.includes("interview")) memory.context.goal = "interview";

    if (msg.includes("remote")) memory.context.remote = true;
    if (msg.includes("fresher")) memory.context.level = "fresher";
  }
}

module.exports = Orchestrator;