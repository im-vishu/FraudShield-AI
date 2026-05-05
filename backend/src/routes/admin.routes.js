const express = require("express");
const {
  adminStats,
  riskDistribution,
  transactionTrends,
  auditLogs,
  recentHighRiskTransactions
} = require("../controllers/admin.controller");
const {
  authenticate,
  authorizeRoles
} = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);
router.use(authorizeRoles("ADMIN"));

router.get("/stats", adminStats);
router.get("/risk-distribution", riskDistribution);
router.get("/transaction-trends", transactionTrends);
router.get("/audit-logs", auditLogs);
router.get("/high-risk-transactions", recentHighRiskTransactions);

module.exports = router;