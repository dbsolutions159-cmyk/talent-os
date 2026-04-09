const express = require("express");
const router = express.Router();
const supabase = require("../config/supabase");

/* ================= GET LATEST CANDIDATE ================= */

router.get("/latest", async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.json({
        success: false,
        error: "userId required"
      });
    }

    const { data, error } = await supabase
      .from("candidates")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) throw error;

    return res.json({
      success: true,
      candidate: data[0] || null
    });

  } catch (err) {
    console.error("❌ Latest Candidate Error:", err);
    res.json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;