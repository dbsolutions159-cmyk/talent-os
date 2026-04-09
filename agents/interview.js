class Interview {
  async process(candidates) {
    return candidates.map(c => ({
      ...c,
      interviewScore: Math.floor(Math.random() * 100)
    }));
  }
}

module.exports = Interview;