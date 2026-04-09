const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 🔥 Generate Question
async function generateQuestion(role = "customer support") {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
    Generate 1 interview question for ${role}.
    Keep it realistic and professional.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();

    return text;

  } catch (err) {
    console.error("Question Error:", err.message);
    return "Tell me about yourself.";
  }
}

// 🔥 Evaluate Answer
async function evaluateAnswer(question, answer) {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash"
    });

    const prompt = `
    Evaluate this answer:

    Question: ${question}
    Answer: ${answer}

    Give:
    - Score out of 10
    - Short feedback
    `;

    const result = await model.generateContent(prompt);
    return result.response.text();

  } catch (err) {
    console.error("Evaluation Error:", err.message);
    return "Score: 5 - Average answer";
  }
}

module.exports = {
  generateQuestion,
  evaluateAnswer
};