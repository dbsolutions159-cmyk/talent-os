const { callAI } = require("./aiProvider");

const generateQuestions = async (pattern, role, difficulty) => {
  const questions = [];

  for (let type of pattern) {
    const prompt = `
    Generate 3 UNIQUE ${type} questions for ${role}.
    Difficulty: ${difficulty}.
    Avoid common questions.
    Make it real-world and tough.
    
    Return JSON array:
    [
      { "question": "...", "type": "${type}" }
    ]
    `;

    const text = await callAI(prompt);

    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      parsed = [];
    }

    questions.push(...parsed);
  }

  return questions;
};

module.exports = { generateQuestions };