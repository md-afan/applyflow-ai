const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { supabaseAdmin } = require("../config/supabase");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("applications")
      .select("*")
      .eq("user_id", req.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    const applications = data || [];

    const summary = {
      total: applications.length,

      applied: applications.filter(
        (app) => app.status === "applied"
      ).length,

      shortlisted: applications.filter(
        (app) => app.status === "shortlisted"
      ).length,

      interview: applications.filter(
        (app) => app.status === "interview"
      ).length,

      selected: applications.filter(
        (app) => app.status === "selected"
      ).length,

      rejected: applications.filter(
        (app) => app.status === "rejected"
      ).length,
    };

    const today = new Date().toISOString().split("T")[0];

    const upcomingDeadlines = applications
      .filter(
        (app) =>
          app.deadline &&
          app.deadline >= today &&
          app.status !== "rejected"
      )
      .sort((a, b) =>
        a.deadline.localeCompare(b.deadline)
      )
      .slice(0, 5);

    res.json({
      summary,
      upcomingDeadlines,
    });
  } catch (error) {
    console.error("Dashboard error:", error);

    res.status(500).json({
      error: "Failed to load dashboard",
    });
  }
});

module.exports = router;