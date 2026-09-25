const express = require("express");
const cors = require("cors");
const { serve } = require("inngest/express");

require("dotenv").config();

const protectedRoutes = require("./routes/protected");
const applicationRoutes = require("./routes/applications");
const dashboardRoutes = require("./routes/dashboard");
const aiRoutes = require("./routes/ai");
const skillsRoutes = require("./routes/skills");
const reminderRoutes = require("./routes/reminders");
const interviewRoutes = require("./routes/interviews");
const reportRoutes = require("./routes/reports");

const { inngest } = require("./inngest/client");
const { functions } = require("./inngest/functions");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "ApplyFlow AI Backend is running",
    status: "OK",
  });
});

app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "applyflow-ai-backend",
  });
});

// Inngest route
app.use(
  "/api/inngest",
  serve({
    client: inngest,
    functions,
  })
);

// Application routes
app.use("/api/protected", protectedRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api", aiRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/reminders", reminderRoutes);
app.use("/api", interviewRoutes);
app.use("/api/reports", reportRoutes);

app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
  });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(
    `ApplyFlow AI Backend running on http://localhost:${PORT}`
  );
});