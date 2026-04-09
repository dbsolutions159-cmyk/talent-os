function evaluateAnswers(answers) {

  let score = 0;

  // MCQ
  if (answers.mcq1_correct) score += 20;

  // grammar
  if (answers.grammar === "He goes") score += 20;

  // text quality
  if (answers.text0?.length > 20) score += 20;
  if (answers.text1?.length > 20) score += 20;

  // consistency
  if (answers.text0 && answers.text1) score += 20;

  return score;
}

function finalDecision(score, trust) {

  if (score >= 80 && trust >= 70) return "Selected";
  if (score >= 60) return "Review";
  return "Rejected";
}

module.exports = { evaluateAnswers, finalDecision };