const express = require("express");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");
const { getReports, getReport } = require("../controllers/report.controller");

const router = express.Router();

router.use(authenticate);

// Users can see only their own reports (enforced by service); analysts/admins see all.
router.get("/", authorizeRoles("ADMIN", "ANALYST", "USER"), getReports);
router.get("/:id", authorizeRoles("ADMIN", "ANALYST", "USER"), getReport);

module.exports = router;

