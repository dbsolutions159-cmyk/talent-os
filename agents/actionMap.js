/* ================= ACTION MAP ================= */

const ACTION_MAP = {

  /* ================= JOB ================= */
  JOB_SEARCH: "job_search",
  JOB_SUGGEST: "job_suggest",

  /* ================= RESUME ================= */
  RESUME_BUILDER: "resume_builder",
  UPLOAD_RESUME: "upload_resume",
  CHECK_SCORE: "check_score",

  /* ================= WRITING ================= */
  EMAIL_WRITER: "email_writer",
  APPLICATION_WRITER: "application_writer",

  /* ================= IMAGE ================= */
  IMAGE_GENERATE: "image_generate",

  /* ================= ASSESSMENT ================= */
  SCHEDULE_ASSESSMENT: "schedule_assessment",
  START_ASSESSMENT: "start_assessment",

  /* ================= INTERVIEW ================= */
  INTERVIEW: "start_interview",
  ASK_QUESTION: "ask_question",

  /* ================= GENERAL ================= */
  GENERAL: "general_help"
};

/* ================= SAFE GET ACTION ================= */

function getAction(intent) {
  const action = ACTION_MAP[intent];

  if (!action) {
    console.warn("⚠️ Unknown intent:", intent, "→ fallback GENERAL");
    return "general_help";
  }

  return action;
}

module.exports = {
  getAction,
  ACTION_MAP // 🔥 export for debugging / scaling
};