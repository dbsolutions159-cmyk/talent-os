const roles = {
  customer: [
    "Tell me about yourself",
    "Handle an angry customer",
    "What is empathy?",
    "Why should we hire you?"
  ],
  developer: [
    "Explain async await",
    "What is event loop?",
    "Optimize API",
    "System design basics"
  ]
};

function shuffle(arr) {
  return arr.sort(() => 0.5 - Math.random());
}

function generateInterview(role = "customer") {
  const base = roles[role] || roles.customer;

  const selected = shuffle(base).slice(0, 3);

  return selected.map((q, i) => ({
    id: "q" + (i + 1),
    question: q
  }));
}

module.exports = { generateInterview };