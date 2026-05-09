const express = require("express");
const {
  getAlerts,
  getRecentAlerts,
  investigateAlert,
  dismissAlert,
  resolveAlert
} = require("../controllers/alert.controller");
const {
  authenticate,
  authorizeRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.get("/", authorizeRoles("ADMIN", "ANALYST"), getAlerts);
router.get("/recent", authorizeRoles("ADMIN", "ANALYST"), getRecentAlerts);
router.patch(
  "/:alertId/investigate",
  authorizeRoles("ADMIN", "ANALYST"),
  investigateAlert
);
router.patch(
  "/:alertId/dismiss",
  authorizeRoles("ADMIN", "ANALYST"),
  dismissAlert
);
router.patch(
  "/:alertId/resolve",
  authorizeRoles("ADMIN", "ANALYST"),
  resolveAlert
);

module.exports = router;
