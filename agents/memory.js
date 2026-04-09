const memoryStore = {};

function getMemory(userId) {
  if (!memoryStore[userId]) {
    memoryStore[userId] = {
      history: [],
      context: {},
      lastIntent: null,
      lastAction: null
    };
  }

  return memoryStore[userId];
}

function saveMemory(userId, memory) {
  memoryStore[userId] = memory;
}

module.exports = { getMemory, saveMemory };