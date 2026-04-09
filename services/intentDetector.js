function detectIntent(message) {
  const t = message.toLowerCase();

  if (t.includes("resume")) return "resume";
  if (t.includes("job")) return "career";
  if (t.includes("interview")) return "interview";

  return "general";
}

module.exports = { detectIntent };