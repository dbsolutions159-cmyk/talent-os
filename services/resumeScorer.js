function scoreResume(text) {
  let score = 0;

  const skills = [
    "javascript", "node", "react", "mongodb",
    "python", "sql", "aws", "api", "backend"
  ];

  skills.forEach(skill => {
    if (text.toLowerCase().includes(skill)) {
      score += 10;
    }
  });

  if (text.length > 1000) score += 20;

  if (score > 100) score = 100;

  return score;
}

module.exports = { scoreResume };