const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

/* ===== GET SHORTLIST ===== */
router.get("/shortlisted", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("status", "SHORTLISTED")
      .order("finalScore", { ascending: false });

    if (error) throw error;

    res.json({ success: true, candidates: data });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

/* ===== APPROVE / REJECT ===== */
router.post("/decision", async (req, res) => {
  try {
    const { candidateId, status, salary, notes } = req.body;

    if (!candidateId || !status) {
      return res.json({
        success: false,
        error: "candidateId & status required"
      });
    }

    const update = {
      status,
      decision_notes: notes || null
    };

    if (status === "APPROVED") {
      if (!salary) {
        return res.json({
          success: false,
          error: "Salary required"
        });
      }
      update.salary = salary;
    }

    const { data, error } = await supabase
      .from("candidates")
      .update(update)
      .eq("id", candidateId)
      .select();

    if (error) throw error;

    res.json({
      success: true,
      message: `Candidate ${status}`,
      candidate: data[0]
    });

  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;