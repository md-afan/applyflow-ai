const { supabaseAuth } = require("../config/supabase");

async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization;

    if (!header) {
      return res.status(401).json({
        error: "Authorization required",
      });
    }

    if (!header.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Invalid authorization format",
      });
    }

    const token = header.replace("Bearer ", "");

    const {
      data,
      error,
    } = await supabaseAuth.auth.getUser(token);

    if (error || !data.user) {
      return res.status(401).json({
        error: "Invalid or expired token",
      });
    }

    req.user = data.user;

    next();
  } catch (error) {
    console.error("Authentication error:", error);

    return res.status(401).json({
      error: "Authentication failed",
    });
  }
}

module.exports = {
  requireAuth,
};