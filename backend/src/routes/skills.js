const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { supabaseAdmin } = require("../config/supabase");

const router = express.Router();

router.get("/", requireAuth, async (req, res) => {
  const { data, error } = await supabaseAdmin
    .from("skills")
    .select("*")
    .eq("user_id", req.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json(data);
});

router.post("/", requireAuth, async (req, res) => {
  const { skill } = req.body;

  if (!skill || !skill.trim()) {
    return res.status(400).json({
      error: "Skill is required",
    });
  }

  const { data, error } = await supabaseAdmin
    .from("skills")
    .insert({
      user_id: req.user.id,
      skill: skill.trim(),
    })
    .select()
    .single();

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.status(201).json(data);
});

router.delete("/:id", requireAuth, async (req, res) => {
  const { error } = await supabaseAdmin
    .from("skills")
    .delete()
    .eq("id", req.params.id)
    .eq("user_id", req.user.id);

  if (error) {
    return res.status(500).json({
      error: error.message,
    });
  }

  res.json({
    message: "Skill deleted successfully",
  });
});

module.exports = router;