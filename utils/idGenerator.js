const crypto = require("crypto");

function generateCandidateId(email) {
  const random = crypto.randomBytes(4).toString("hex");
  const timestamp = Date.now().toString().slice(-6);

  return `DB-${timestamp}-${random}`;
}

module.exports = { generateCandidateId };