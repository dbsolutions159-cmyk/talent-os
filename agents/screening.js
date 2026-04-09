class Screening {
  async filter(candidates, job) {
    return candidates.filter(c =>
      c.skills.some(skill => job.skills.includes(skill))
    );
  }
}

module.exports = Screening;