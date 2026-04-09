const axios = require("axios");

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";

class AIAgent {

  async analyze(message, memory) {
    try {

      const history = memory.history.slice(-5); // last 5 msgs

      const messages = [
        {
          role: "system",
          content: `
You are Zentro AI career assistant.

You must:
- Understand full conversation
- Track user context (skills, resume, job)
- Respond like human recruiter
- Return JSON:

{
  "intent": "...",
  "reply": "...",
  "confidence": 0.9
}
`
        },

        ...history,

        {
          role: "user",
          content: message
        }
      ];

      const res = await axios.post(
        OPENROUTER_API,
        {
          model: "openai/gpt-3.5-turbo",
          messages
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const output = res.data.choices[0].message.content;

      return JSON.parse(output);

    } catch (err) {
      console.error("AI error:", err.message);

      return {
        intent: "GENERAL",
        reply: "Sorry, I didn't understand.",
        confidence: 0.3
      };
    }
  }
}

module.exports = AIAgent;