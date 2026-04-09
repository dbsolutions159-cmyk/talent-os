let matches = [];

// SAVE MATCH
function saveMatch(data) {
  const newData = {
    id: Date.now(),
    createdAt: new Date(),
    ...data
  };

  matches.push(newData);
}

// GET ALL MATCHES (sorted)
function getMatches() {
  return matches.sort((a, b) => b.finalScore - a.finalScore);
}

// CLEAR (optional)
function clearMatches() {
  matches = [];
}

module.exports = {
  saveMatch,
  getMatches,
  clearMatches
};