async function scoreAssessmentAI(answers) {
  let totalScore = 0;

  for (let i = 0; i < answers.length; i++) {
    const a = answers[i];

    if (!a || !a.answer) continue;

    let score = 0;
    const ans = a.answer.toLowerCase();

    if (ans.length > 5) score += 2;
    if (ans.length > 15) score += 2;

    totalScore += score;
  }

  const finalScore = Math.round((totalScore / (answers.length * 10)) * 100);

  let result = "Rejected";
  if (finalScore >= 75) result = "Selected";
  else if (finalScore >= 50) result = "Shortlisted";

  return { score: finalScore, result };
}

module.exports = { scoreAssessmentAI };