const axios = require("axios");

const scoreCandidate = async (candidate, job) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          {
            role: "system",
            content: "You are an AI hiring expert."
          },
          {
            role: "user",
            content: `
Evaluate this candidate for the job.

Candidate:
Name: ${candidate.name}
Skills: ${candidate.skills}
Experience: ${candidate.experience}

Job:
Title: ${job.title}
Required Skills: ${job.skills}
Experience Required: ${job.experience}

Return ONLY JSON:
{
  "score": number (0-100),
  "match": "Weak | متوسط | Strong",
  "decision": "REJECTED | SHORTLISTED | SELECTED"
}
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
    console.error("AI Scoring Error:", err.message);
    return null;
  }
};

module.exports = scoreCandidate;