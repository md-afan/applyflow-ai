const express = require("express");
const path = require("path");
const fs = require("fs");
const { requireAuth } = require("../middleware/auth");
const { supabaseAdmin } = require("../config/supabase");
const {
  generateApplicationReport,
} = require("../services/pdfService");

const router = express.Router();

router.post("/", requireAuth, async (req, res) => {
  try {
    // Get current user's applications
    const { data: applications, error } =
      await supabaseAdmin
        .from("applications")
        .select("*")
        .eq("user_id", req.user.id)
        .order("created_at", {
          ascending: false,
        });

    if (error) {
      return res.status(500).json({
        error: error.message,
      });
    }

    const apps = applications || [];

    const summary = {
      total: apps.length,

      applied: apps.filter(
        (app) => app.status === "applied"
      ).length,

      shortlisted: apps.filter(
        (app) => app.status === "shortlisted"
      ).length,

      interview: apps.filter(
        (app) => app.status === "interview"
      ).length,

      selected: apps.filter(
        (app) => app.status === "selected"
      ).length,

      rejected: apps.filter(
        (app) => app.status === "rejected"
      ).length,
    };

    const generatedDate =
      new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      });

    const reportData = {
      userName:
        req.user.user_metadata?.full_name ||
        req.user.email,

      generatedDate,

      summary,

      applications: apps,
    };

    // Make sure reports directory exists
    const reportsDir = path.join(
      process.cwd(),
      "reports"
    );

    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, {
        recursive: true,
      });
    }

    const reportId =
      `${req.user.id}-${Date.now()}`;

    const fileName = `${reportId}.pdf`;

    const filePath = path.join(
      reportsDir,
      fileName
    );

    await generateApplicationReport(
      reportData,
      filePath
    );

    // Save metadata
    const { data: report, error: reportError } =
      await supabaseAdmin
        .from("reports")
        .insert({
          user_id: req.user.id,
          file_path: fileName,
        })
        .select()
        .single();

    if (reportError) {
      return res.status(500).json({
        error: reportError.message,
      });
    }

    res.status(201).json({
      message: "Report generated successfully",
      reportId: report.id,
      fileName,
      downloadUrl:
        `/api/reports/${report.id}/file`,
    });
  } catch (error) {
    console.error(
      "Report generation error:",
      error
    );

    res.status(500).json({
      error: "Failed to generate report",
    });
  }
});


// Download PDF
router.get(
  "/:id/file",
  requireAuth,
  async (req, res) => {
    try {
      const { data: report, error } =
        await supabaseAdmin
          .from("reports")
          .select("*")
          .eq("id", req.params.id)
          .eq("user_id", req.user.id)
          .single();

      if (error || !report) {
        return res.status(404).json({
          error: "Report not found",
        });
      }

      const filePath = path.join(
        process.cwd(),
        "reports",
        report.file_path
      );

      if (!fs.existsSync(filePath)) {
        return res.status(404).json({
          error: "Report file not found",
        });
      }

      res.download(
        filePath,
        "applyflow-application-report.pdf"
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: "Failed to download report",
      });
    }
  }
);

module.exports = router;