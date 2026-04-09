const memory = {};

function getMemory(userId) {
  return memory[userId] || [];
}

function addMessage(userId, role, content) {
  if (!memory[userId]) {
    memory[userId] = [];
  }

  memory[userId].push({ role, content });

  // 🔥 Limit memory (last 10 messages only)
  if (memory[userId].length > 10) {
    memory[userId].shift();
  }
}

module.exports = { getMemory, addMessage };