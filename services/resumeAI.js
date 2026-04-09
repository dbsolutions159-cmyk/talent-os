const fs = require("fs");
const pdf = require("pdf-parse");
const axios = require("axios");

const analyzeResume = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdf(dataBuffer);

    const content = pdfData.text;

    const prompt = `
Analyze this resume:

Return JSON:
{
  "status": "SELECTED or REJECTED",
  "score": number,
  "skills": [],
  "message": ""
}

Resume:
${content}
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const aiText = response.data.choices[0].message.content;

    let parsed;
    try {
      parsed = JSON.parse(aiText);
    } catch {
      parsed = {
        status: "ERROR",
        score: 0,
        skills: [],
        message: aiText
      };
    }

    return parsed;

  } catch (err) {
    console.error(err);

    return {
      status: "ERROR",
      score: 0,
      message: "AI failed"
    };
  }
};

module.exports = { analyzeResume };