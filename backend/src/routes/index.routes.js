const express = require("express");
const { successResponse } = require("../utils/apiResponse");

const router = express.Router();

router.get("/", (req, res) => {
  return successResponse(res, 200, "FraudShield AI API", {
    health: "/api/health",
    auth: "/api/auth",
    transactions: "/api/transactions",
    alerts: "/api/alerts",
    reports: "/api/reports"
  });
});

module.exports = router;

