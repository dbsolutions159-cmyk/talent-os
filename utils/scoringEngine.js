const axios = require("axios");

const OPENROUTER_API = "https://openrouter.ai/api/v1/chat/completions";

/* ================= SKILL EXTRACTION ================= */

function extractSkills(text = "") {
  const skills = [];

  const skillList = [
    "react","node","python","java",
    "customer service","communication",
    "support","sales","excel",
    "management","team","leadership",
    "ai","data","analysis"
  ];

  const lower = text.toLowerCase();

  skillList.forEach(skill => {
    if (lower.includes(skill)) skills.push(skill);
  });

  return [...new Set(skills)];
}

/* ================= EXPERIENCE ================= */

function extractExperience(text = "") {
  const match = text.toLowerCase().match(/(\d+)\+?\s*(year|yr)/);
  return match ? parseInt(match[1]) : 0;
}

/* ================= RULE SCORE ================= */

function ruleScore({ text, skills, exp }) {
  let score = 0;

  if (skills.length >= 6) score += 30;
  else if (skills.length >= 3) score += 20;
  else if (skills.length >= 1) score += 10;

  if (exp >= 5) score += 25;
  else if (exp >= 2) score += 15;
  else if (exp >= 1) score += 10;

  const keywords = ["communication","customer service","support","team","manage"];
  let match = 0;

  keywords.forEach(k => {
    if (text.toLowerCase().includes(k)) match++;
  });

  score += match * 5;

  if (text.toLowerCase().includes("bachelor")) score += 10;

  return Math.min(score, 100);
}

/* ================= SAFE JSON PARSER ================= */

function safeJSONParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return JSON.parse(cleaned);
  }
}

/* ================= GPT ANALYSIS ================= */

async function aiScore(resume_text) {
  try {

    const prompt = `
You are a senior recruiter.

Analyze the resume deeply.

Return ONLY JSON:

{
  "score": number (0-100),
  "strengths": ["..."],
  "weaknesses": ["..."],
  "summary": "short professional summary",
  "roleFit": "best job role for this candidate"
}

Resume:
${resume_text}
`;

    const res = await axios.post(
      OPENROUTER_API,
      {
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }]
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const raw = res.data.choices[0].message.content;

    return safeJSONParse(raw);

  } catch (err) {
    console.error("AI ERROR:", err.message);

    return {
      score: 50,
      strengths: [],
      weaknesses: [],
      summary: "AI failed",
      roleFit: "general"
    };
  }
}

/* ================= MAIN ================= */

async function processResume(resume_text = "") {

  const skills = extractSkills(resume_text);
  const experience = extractExperience(resume_text);

  const rule = ruleScore({
    text: resume_text,
    skills,
    exp: experience
  });

  const ai = await aiScore(resume_text);

  const finalScore = Math.round((rule * 0.6) + (ai.score * 0.4));

  let status = "REJECTED";
  if (finalScore >= 75) status = "SELECTED";
  else if (finalScore >= 50) status = "SHORTLISTED";

  return {
    skills,
    experience,
    ruleScore: rule,
    aiScore: ai.score,
    finalscore: finalScore,
    status,
    roleFit: ai.roleFit,
    aiAnalysis: {
      strengths: ai.strengths,
      weaknesses: ai.weaknesses,
      summary: ai.summary
    }
  };
}

module.exports = {
  processResume
};