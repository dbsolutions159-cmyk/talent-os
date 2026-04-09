let userFlags = {};

function addFlag(userId, type) {
  if (!userFlags[userId]) {
    userFlags[userId] = {
      score: 0,
      flags: []
    };
  }

  userFlags[userId].flags.push(type);

  // SCORING
  if (type === "tab_switch") userFlags[userId].score += 20;
  if (type === "paste_detected") userFlags[userId].score += 30;
  if (type === "copy_attempt") userFlags[userId].score += 10;
  if (type === "fullscreen_exit") userFlags[userId].score += 25;
  if (type === "ai_typing_detected") userFlags[userId].score += 40;

  return userFlags[userId];
}

function getUserReport(userId) {
  return userFlags[userId] || { score: 0, flags: [] };
}

module.exports = { addFlag, getUserReport };