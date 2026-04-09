function scoreAnswer(answer) {

  if (!answer) return 0;

  let score = 0;

  if (answer.length > 20) score += 30;

  if (answer.toLowerCase().includes("customer")) score += 20;
  if (answer.toLowerCase().includes("solution")) score += 20;

  if (answer.includes(".")) score += 10;

  return Math.min(score, 100);
}

function evaluateInterview(answers) {

  let total = 0;

  Object.values(answers).forEach(ans => {
    total += scoreAnswer(ans);
  });

  const avg = Math.round(total / Object.keys(answers).length);

  return avg;
}

function finalDecision(score, trust) {
  if (score >= 80 && trust >= 70) return "Selected";
  if (score >= 60) return "Review";
  return "Rejected";
}

module.exports = { evaluateInterview, finalDecision };