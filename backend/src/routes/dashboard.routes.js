const router = require("express").Router();
const { getDashboardStats } = require("../controllers/dashboard.controller");

// Use your existing auth middleware (name may differ)
// Common names: protect, requireAuth, auth, verifyToken
const { requireAuth } = require("../middleware/auth");

router.get("/stats", requireAuth, getDashboardStats);

module.exports = router;
