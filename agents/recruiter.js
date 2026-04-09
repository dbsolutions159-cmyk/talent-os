const supabase = require("../config/supabase");

class Recruiter {
  async findCandidates(job) {
    const { data, error } = await supabase
      .from("candidates")
      .select("*");

    if (error) throw error;

    return data;
  }
}

module.exports = Recruiter;