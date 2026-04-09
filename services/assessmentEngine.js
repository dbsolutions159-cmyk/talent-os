const roles = {
  customer: [
    "Handle an angry customer situation",
    "Write a refund email",
    "Explain customer empathy"
  ],
  developer: [
    "Explain async await",
    "Difference between REST & GraphQL",
    "Optimize a slow API"
  ]
};

// random generator
function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

// generate dynamic test
function generateAssessment(role = "customer") {

  const baseQuestions = roles[role] || roles.customer;

  const test = [];

  // 🔥 dynamic MCQ
  const num1 = Math.floor(Math.random() * 10);
  const num2 = Math.floor(Math.random() * 10);

  test.push({
    id: "mcq1",
    question: `${num1} + ${num2} = ?`,
    options: [
      num1 + num2,
      num1 + num2 + 1,
      num1 + num2 - 1
    ],
    answer: num1 + num2
  });

  // 🔥 grammar dynamic
  test.push({
    id: "grammar",
    question: "Choose correct:",
    options: ["He go", "He goes"],
    answer: "He goes"
  });

  // 🔥 role-based questions
  const dynamicQ = shuffle(baseQuestions).slice(0, 2);

  dynamicQ.forEach((q, i) => {
    test.push({
      id: "text" + i,
      question: q,
      type: "text"
    });
  });

  return test;
}

module.exports = { generateAssessment };