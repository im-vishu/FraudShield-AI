const express = require("express");
const { authenticate, authorizeRoles } = require("../middleware/auth.middleware");
const { listAuditLogs } = require("../controllers/audit.controller");

const router = express.Router();

router.use(authenticate);

// Users can only see their own logs; analysts/admins can see all.
router.get("/", authorizeRoles("ADMIN", "ANALYST", "USER"), listAuditLogs);

module.exports = router;

