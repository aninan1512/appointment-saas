require("dotenv").config();

const { createApp } = require("./app");
const { connectDB } = require("./config/db");

const PORT = process.env.PORT || 5000;

async function start() {
  try {
    await connectDB(process.env.MONGODB_URI);

    const app = createApp();

    // ✅ Root endpoint (so Render primary URL doesn't show "Not Found")
    app.get("/", (req, res) => {
      res.status(200).json({
        ok: true,
        message: "Appointment SaaS API is running",
      });
    });

    // ✅ Health check endpoint (useful for monitoring)
    app.get("/health", (req, res) => {
      res.status(200).json({ ok: true });
    });

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("❌ Server failed to start:", err.message);
    process.exit(1);
  }
}

start();

