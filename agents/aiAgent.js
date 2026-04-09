const axios = require("axios");

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";

class AIAgent {

  async analyze(message, memory = {}) {
    try {
      const msg = message.toLowerCase().trim();
      const context = memory.context || {};
      const history = memory.history || [];

      /* ================= HELPER ================= */

      const has = (words) => words.some(w => msg.includes(w));

      /* ================= ⚡ FAST RULE ENGINE ================= */

      // 🔥 EMAIL
      if (has(["email", "mail"])) {
        return this.response("EMAIL_WRITER", "✉️ Writing a professional email...", 0.95);
      }

      // 🔥 APPLICATION
      if (has(["leave", "application"])) {
        return this.response("APPLICATION_WRITER", "📝 Creating your application...", 0.95);
      }

      // 🔥 RESUME
      if (has(["resume", "cv"])) {
        return this.response("RESUME_BUILDER", "📄 Working on your resume...", 0.95);
      }

      // 🔥 IMAGE
      if (has(["image", "poster", "design"])) {
        return this.response("IMAGE_GENERATE", "🎨 Generating image...", 0.9);
      }

      // 🔥 JOB
      if (
        has(["job", "work", "hiring"]) ||
        has(["react", "node", "python", "java"])
      ) {
        return this.response("JOB_SEARCH", "🔥 Finding best jobs for you...", 0.95);
      }

      // 🔥 INTERVIEW
      if (has(["interview"])) {
        return this.response("INTERVIEW", "🎯 Preparing interview for you...", 0.9);
      }

      /* ================= 🧠 GPT BRAIN ================= */

      const gptResponse = await axios.post(
        OPENROUTER_API,
        {
          model: "openai/gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: `
You are Zentro AI (career + education assistant).

Rules:
- Understand user intent
- Give helpful reply
- Stay in career/education domain
- Respond ONLY in JSON:

{
 "intent": "...",
 "reply": "...",
 "confidence": 0.9
}
`
            },

            ...history.slice(-4), // last 4 messages

            {
              role: "user",
              content: message
            }
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const raw = gptResponse.data.choices[0].message.content;

      /* ================= SAFE PARSE ================= */

      try {
        const parsed = JSON.parse(raw);

        return {
          intent: parsed.intent || "GENERAL",
          reply: parsed.reply || "I'm here to help you.",
          confidence: parsed.confidence ?? 0.7
        };

      } catch (parseErr) {
        console.warn("⚠️ JSON parse failed → fallback");

        return this.response("GENERAL", raw, 0.6);
      }

    } catch (err) {
      console.error("❌ AI Agent error:", err.message);

      return this.response(
        "GENERAL",
        "⚠️ AI error. Please try again.",
        0.3
      );
    }
  }

  /* ================= HELPER ================= */

  response(intent, reply, confidence) {
    return { intent, reply, confidence };
  }
}

module.exports = AIAgent;