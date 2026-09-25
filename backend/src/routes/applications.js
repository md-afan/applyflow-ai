const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { supabaseAdmin } = require("../config/supabase");

const router = express.Router();

const allowedStatuses = [
  "applied",
  "shortlisted",
  "interview",
  "selected",
  "rejected",
];

// GET all applications
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

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch applications",
    });
  }
});


// GET single application
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("applications")
      .select("*")
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .single();

    if (error) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch application",
    });
  }
});


// CREATE application
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      company,
      role,
      job_url,
      job_description,
      status,
      deadline,
      notes,
    } = req.body;

    if (!company || !role) {
      return res.status(400).json({
        error: "Company and role are required",
      });
    }

    const applicationStatus = status || "applied";

    if (!allowedStatuses.includes(applicationStatus)) {
      return res.status(400).json({
        error: "Invalid application status",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("applications")
      .insert({
        user_id: req.user.id,
        company,
        role,
        job_url: job_url || null,
        job_description: job_description || null,
        status: applicationStatus,
        deadline: deadline || null,
        notes: notes || null,
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    res.status(201).json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to create application",
    });
  }
});


// UPDATE application
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const {
      company,
      role,
      job_url,
      job_description,
      status,
      deadline,
      notes,
    } = req.body;

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        error: "Invalid application status",
      });
    }

    const updates = {};

    if (company !== undefined) updates.company = company;
    if (role !== undefined) updates.role = role;
    if (job_url !== undefined) updates.job_url = job_url;
    if (job_description !== undefined) {
      updates.job_description = job_description;
    }
    if (status !== undefined) updates.status = status;
    if (deadline !== undefined) updates.deadline = deadline;
    if (notes !== undefined) updates.notes = notes;

    updates.updated_at = new Date().toISOString();

    const { data, error } = await supabaseAdmin
      .from("applications")
      .update(updates)
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(404).json({
        error: "Application not found",
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update application",
    });
  }
});


// DELETE application
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from("applications")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.user.id);

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    res.json({
      message: "Application deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete application",
    });
  }
});

module.exports = router;