const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const {
  listAppointments,
  createAppointment,
  updateStatus
} = require("../controllers/appointments.controller");

router.get("/", requireAuth, listAppointments);
router.post("/", requireAuth, createAppointment);

// Phase 2.3: update status (cancel/complete)
router.patch("/:id/status", requireAuth, updateStatus);

module.exports = router;
