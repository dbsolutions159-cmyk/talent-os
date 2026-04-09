const { analyzeResumeAI } = require("./aiService");

/* ================= NORMALIZE SKILLS ================= */

function normalizeSkills(skills = []) {
  return skills.map(s => s.toLowerCase().trim());
}

/* ================= BASIC MATCH ================= */

function calculateMatchScore(candidateSkills = [], requiredSkills = []) {
  const cSkills = normalizeSkills(candidateSkills);
  const rSkills = normalizeSkills(requiredSkills);

  let matchCount = 0;

  rSkills.forEach(skill => {
    if (cSkills.includes(skill)) {
      matchCount++;
    }
  });

  if (rSkills.length === 0) return 0;

  return Math.round((matchCount / rSkills.length) * 100);
}

/* ================= DECISION ENGINE ================= */

function getDecision(score) {
  if (score >= 75) return "SELECTED";
  if (score >= 50) return "REVIEW";
  return "REJECTED";
}

/* ================= SAFE JSON PARSER ================= */

function extractJSON(text) {
  try {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
  } catch (e) {}

  return null;
}

/* ================= AI MATCH ================= */

async function aiMatch(resumeText, jobDescription) {
  try {
    const prompt = `
You are an AI hiring expert.

Resume:
${resumeText}

Job Description:
${jobDescription}

IMPORTANT:
- Return ONLY valid JSON
- No explanation

Format:
{
  "matchScore": number (0-100),
  "matchedSkills": ["skill1"],
  "missingSkills": ["skill2"],
  "decision": "SELECTED / REVIEW / REJECTED"
}
`;

    const aiRaw = await analyzeResumeAI(prompt);

    let parsed = aiRaw;

    // अगर string आया
    if (typeof aiRaw === "string") {
      parsed = extractJSON(aiRaw);
    }

    if (!parsed) {
      throw new Error("AI parse failed");
    }

    return {
      matchScore: parsed.matchScore || 60,
      matchedSkills: parsed.matchedSkills || [],
      missingSkills: parsed.missingSkills || [],
      decision: parsed.decision || getDecision(parsed.matchScore || 60)
    };

  } catch (err) {
    console.error("❌ AI Match Error:", err.message);

    return {
      matchScore: 50,
      matchedSkills: [],
      missingSkills: [],
      decision: "REVIEW"
    };
  }
}

module.exports = {
  calculateMatchScore,
  aiMatch,
  getDecision
};