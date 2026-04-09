const { callAI } = require("./aiProvider");

const evaluateAnswer = async (question, answer) => {
  const prompt = `
  Evaluate this answer strictly.

  Question: ${question}
  Answer: ${answer}

  Give score out of 20.
  Only return number.
  `;

  const result = await callAI(prompt);

  const score = parseInt(result) || 10;

  return score;
};

module.exports = { evaluateAnswer };