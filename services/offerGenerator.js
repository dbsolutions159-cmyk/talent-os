const generateOffer = (candidate, job) => {
  return `
    <h2>🎉 Congratulations ${candidate.name}</h2>

    <p>You are selected for <b>${job.title}</b> role.</p>

    <h3>Details:</h3>
    <ul>
      <li>Skills: ${candidate.skills.join(", ")}</li>
      <li>Experience: ${candidate.experience} years</li>
      <li>Score: ${candidate.finalScore}</li>
    </ul>

    <p>Welcome to Zentro AI 🚀</p>
  `;
};

module.exports = generateOffer;