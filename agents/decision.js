class Decision {
  async select(candidates) {
    if (!Array.isArray(candidates) || candidates.length === 0) {
      throw new Error("No candidates to shortlist");
    }

    const sorted = candidates
      .map(c => ({
        ...c,
        finalScore: typeof c.finalScore === "number" ? c.finalScore : 0
      }))
      .sort((a, b) => b.finalScore - a.finalScore)
      .slice(0, 5);

    return sorted.map(c => ({
      ...c,
      status: "SHORTLISTED"
    }));
  }
}

module.exports = Decision;