const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");

router.get("/me", requireAuth, (req, res) => {
  res.json({ ok: true, user: req.user });
});

module.exports = router;
