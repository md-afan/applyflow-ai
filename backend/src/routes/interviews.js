const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { supabaseAdmin } = require("../config/supabase");

const router = express.Router();


// GET interviews for an application
router.get(
  "/applications/:applicationId/interviews",
  requireAuth,
  async (req, res) => {
    try {
      const { data: application, error: applicationError } =
        await supabaseAdmin
          .from("applications")
          .select("id")
          .eq("id", req.params.applicationId)
          .eq("user_id", req.user.id)
          .single();

      if (applicationError || !application) {
        return res.status(404).json({
          error: "Application not found",
        });
      }

      const { data, error } = await supabaseAdmin
        .from("interviews")
        .select("*")
        .eq("application_id", req.params.applicationId)
        .order("interview_date", {
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
        error: "Failed to fetch interviews",
      });
    }
  }
);


// CREATE interview
router.post(
  "/applications/:applicationId/interviews",
  requireAuth,
  async (req, res) => {
    try {
      const {
        interview_date,
        interview_type,
        notes,
      } = req.body;

      if (!interview_date) {
        return res.status(400).json({
          error: "Interview date is required",
        });
      }

      // Verify application ownership
      const { data: application, error: applicationError } =
        await supabaseAdmin
          .from("applications")
          .select("id")
          .eq("id", req.params.applicationId)
          .eq("user_id", req.user.id)
          .single();

      if (applicationError || !application) {
        return res.status(404).json({
          error: "Application not found",
        });
      }

      const { data, error } = await supabaseAdmin
        .from("interviews")
        .insert({
          application_id: req.params.applicationId,
          interview_date,
          interview_type: interview_type || null,
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
        error: "Failed to create interview",
      });
    }
  }
);


// DELETE interview
router.delete(
  "/interviews/:id",
  requireAuth,
  async (req, res) => {
    try {
      const { data: interview, error: interviewError } =
        await supabaseAdmin
          .from("interviews")
          .select(`
            id,
            application_id,
            applications (
              user_id
            )
          `)
          .eq("id", req.params.id)
          .single();

      if (
        interviewError ||
        !interview ||
        interview.applications?.user_id !== req.user.id
      ) {
        return res.status(404).json({
          error: "Interview not found",
        });
      }

      const { error } = await supabaseAdmin
        .from("interviews")
        .delete()
        .eq("id", req.params.id);

      if (error) {
        return res.status(500).json({
          error: error.message,
        });
      }

      res.json({
        message: "Interview deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to delete interview",
      });
    }
  }
);


module.exports = router;