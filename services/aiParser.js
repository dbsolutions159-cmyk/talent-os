const axios = require("axios");

const parseResumeWithAI = async (resumeText) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are an AI resume parser. Extract structured data."
          },
          {
            role: "user",
            content: `
Extract:
- Name
- Skills (array)
- Experience (years)
- Score (0-100)

Return ONLY JSON.

Resume:
${resumeText}
            `
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

    const text = response.data.choices[0].message.content;

    return JSON.parse(text);

  } catch (err) {
    console.error("AI Parse Error:", err.message);
    return null;
  }
};

module.exports = parseResumeWithAI;