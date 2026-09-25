const express = require("express");
const { requireAuth } = require("../middleware/auth");
const { supabaseAdmin } = require("../config/supabase");
const { analyzeJob } = require("../services/aiService");

const router = express.Router();

router.post(
  "/applications/:id/analyze",
  requireAuth,
  async (req, res) => {
    try {
      // 1. Get user's application
      const { data: application, error: applicationError } =
        await supabaseAdmin
          .from("applications")
          .select("*")
          .eq("id", req.params.id)
          .eq("user_id", req.user.id)
          .single();

      if (applicationError || !application) {
        return res.status(404).json({
          error: "Application not found",
        });
      }

      // 2. Check job description
      if (!application.job_description) {
        return res.status(400).json({
          error: "Job description is required for AI analysis",
        });
      }

      // 3. Get user's skills
      const { data: skills, error: skillsError } =
        await supabaseAdmin
          .from("skills")
          .select("skill")
          .eq("user_id", req.user.id);

      if (skillsError) {
        return res.status(500).json({
          error: skillsError.message,
        });
      }

      const userSkills = (skills || []).map(
        (item) => item.skill
      );

      if (userSkills.length === 0) {
        return res.status(400).json({
          error: "Add your skills before running AI analysis",
        });
      }

      // 4. Run AI analysis
      const analysis = await analyzeJob(
        application.job_description,
        userSkills
      );

      // 5. Save analysis
      const { data: savedAnalysis, error: saveError } =
        await supabaseAdmin
          .from("ai_analyses")
          .insert({
            application_id: application.id,
            matched_skills: analysis.matched_skills,
            missing_skills: analysis.missing_skills,
            summary: analysis.summary,
          })
          .select()
          .single();

      if (saveError) {
        return res.status(500).json({
          error: saveError.message,
        });
      }

      // 6. Return result
      res.json({
        message: "AI analysis completed",
        analysis: savedAnalysis,
      });
    } catch (error) {
      console.error("AI analysis error:", error);

      res.status(502).json({
        error: "AI analysis failed",
      });
    }
  }
);

module.exports = router;