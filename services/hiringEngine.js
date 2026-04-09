function calculateFinalScore({ assessment, interview, trust }) {

  const finalScore = Math.round(
    (assessment * 0.4) +
    (interview * 0.5) +
    (trust * 0.1)
  );

  return finalScore;
}

function getFinalDecision(score) {

  if (score >= 80) return "Selected";
  if (score >= 65) return "Shortlisted";
  return "Rejected";
}

module.exports = {
  calculateFinalScore,
  getFinalDecision
};