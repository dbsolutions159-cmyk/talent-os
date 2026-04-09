function getDecision(score) {
  if (score >= 70) {
    return {
      status: "SHORTLISTED",
      message: "You are selected for next round"
    };
  } else {
    return {
      status: "REJECTED",
      message: "Your profile does not meet requirements"
    };
  }
}

module.exports = { getDecision };