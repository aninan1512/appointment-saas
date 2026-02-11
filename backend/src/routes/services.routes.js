const router = require("express").Router();
const { requireAuth } = require("../middleware/auth");
const { listServices, createService } = require("../controllers/services.controller");

router.get("/", requireAuth, listServices);
router.post("/", requireAuth, createService);

module.exports = router;
