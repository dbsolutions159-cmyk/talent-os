function calculateRank(candidate) {
  let { score, trust, flags } = candidate;

  let penalty = (flags?.length || 0) * 5;
  let trustFactor = trust / 100;

  let finalScore = (score * trustFactor) - penalty;

  let rank = "Average";

  if (finalScore >= 80) rank = "Top Performer 🏆";
  else if (finalScore >= 60) rank = "Good 👍";
  else if (finalScore >= 40) rank = "Risky ⚠️";
  else rank = "Cheater 🚫";

  return {
    finalScore: Math.round(finalScore),
    rank
  };
}

module.exports = { calculateRank };