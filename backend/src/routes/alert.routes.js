const express = require("express");
const {
  getAlerts,
  getRecentAlerts
} = require("../controllers/alert.controller");
const {
  authenticate,
  authorizeRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/", authorizeRoles("ADMIN", "ANALYST"), getAlerts);
router.get("/recent", authorizeRoles("ADMIN", "ANALYST"), getRecentAlerts);

module.exports = router;