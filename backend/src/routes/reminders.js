const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { supabaseAdmin } = require("../config/supabase");

const router = express.Router();


// GET reminders
router.get("/", requireAuth, async (req, res) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("reminders")
      .select(`
        *,
        applications (
          company,
          role,
          status
        )
      `)
      .eq("user_id", req.user.id)
      .order("reminder_date", {
        ascending: true,
      });

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch reminders",
    });
  }
});


// CREATE reminder
router.post("/", requireAuth, async (req, res) => {
  try {
    const {
      application_id,
      reminder_date,
      reminder_type,
      message,
    } = req.body;

    if (!reminder_date || !reminder_type) {
      return res.status(400).json({
        error: "Reminder date and type are required",
      });
    }

    // If application_id is provided,
    // verify that it belongs to current user.
    if (application_id) {
      const { data: application, error: applicationError } =
        await supabaseAdmin
          .from("applications")
          .select("id")
          .eq("id", application_id)
          .eq("user_id", req.user.id)
          .single();

      if (applicationError || !application) {
        return res.status(404).json({
          error: "Application not found",
        });
      }
    }

    const { data, error } = await supabaseAdmin
      .from("reminders")
      .insert({
        user_id: req.user.id,
        application_id: application_id || null,
        reminder_date,
        reminder_type,
        message: message || null,
        status: "pending",
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
      error: "Failed to create reminder",
    });
  }
});


// MARK REMINDER COMPLETED
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const { status } = req.body;

    if (!["pending", "completed"].includes(status)) {
      return res.status(400).json({
        error: "Invalid reminder status",
      });
    }

    const { data, error } = await supabaseAdmin
      .from("reminders")
      .update({
        status,
      })
      .eq("id", req.params.id)
      .eq("user_id", req.user.id)
      .select()
      .single();

    if (error || !data) {
      return res.status(404).json({
        error: "Reminder not found",
      });
    }

    res.json(data);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to update reminder",
    });
  }
});


// DELETE reminder
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const { error } = await supabaseAdmin
      .from("reminders")
      .delete()
      .eq("id", req.params.id)
      .eq("user_id", req.user.id);

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    res.json({
      message: "Reminder deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to delete reminder",
    });
  }
});


module.exports = router;