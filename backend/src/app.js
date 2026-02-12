const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

// Routes
const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/user.routes");
const servicesRoutes = require("./routes/services.routes");
const appointmentsRoutes = require("./routes/appointments.routes");

// Error middleware
const { notFound, errorHandler } = require("./middleware/error");

function createApp() {
  const app = express();

  // Security + logging
  app.use(helmet());
  app.use(morgan("dev"));

  // Parsers
  app.use(express.json());
  app.use(cookieParser());

  // CORS
  app.use(
    cors({
      origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
      credentials: true
    })
  );

  // Root endpoint (for Render primary URL)
  app.get("/", (req, res) => {
    res.json({
      ok: true,
      message: "Appointment SaaS API is running"
    });
  });

  // Health check
  app.get("/health", (req, res) => {
    res.json({ ok: true, message: "API is healthy" });
  });

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/services", servicesRoutes);
  app.use("/api/appointments", appointmentsRoutes);

  // 404 + error handlers (must stay last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
