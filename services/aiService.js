const axios = require("axios");

exports.analyzeResumeAI = async (resumeText) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mixtral-8x7b-instruct",
        messages: [
          {
            role: "user",
            content: `
Analyze this resume and give response in JSON only:

Resume:
${resumeText}

Return strictly JSON:
{
  "score": number (0-100),
  "skills": ["skill1", "skill2"],
  "message": "short feedback"
}
`
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          
          // 🔥 IMPORTANT (OpenRouter specific)
          "HTTP-Referer": "http://localhost:3000",
          "X-Title": "Zentro AI"
        }
      }
    );

    const aiText = response.data.choices[0].message.content;

    console.log("AI RAW:", aiText);

    // 🔥 SAFE JSON PARSE
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);

    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }

    return {
      score: 60,
      skills: [],
      message: "AI response format issue"
    };

  } catch (err) {
    console.error("AI ERROR:", err.response?.data || err.message);

    return {
      score: 50,
      skills: [],
      message: "AI failed"
    };
  }
};