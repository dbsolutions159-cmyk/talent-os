const axios = require("axios");

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";

async function aiBrain(message, memory) {
  try {
    const res = await axios.post(
      OPENROUTER_API,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `
You are Zentro AI recruiter.

You must:
- Understand user intent
- Decide action (like APPLY_JOB, UPLOAD_RESUME etc)
- Respond like a human

Return JSON:
{
  "intent": "UPLOAD_RESUME",
  "reply": "Sure, please upload your resume"
}
`
          },
          {
            role: "user",
            content: message
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const text = res.data.choices[0].message.content;

    return JSON.parse(text);

  } catch (err) {
    console.error("AI error:", err.message);
    return {
      intent: "GENERAL",
      reply: "Something went wrong"
    };
  }
}

module.exports = aiBrain;