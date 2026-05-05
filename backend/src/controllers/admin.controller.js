const {
  getAdminStats,
  getRiskDistribution,
  getTransactionTrends,
  getAuditLogs,
  getRecentHighRiskTransactions
} = require("../services/admin.service");
const { successResponse } = require("../utils/apiResponse");

const adminStats = async (req, res, next) => {
  try {
    const result = await getAdminStats();
    return successResponse(res, 200, "Admin stats fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const riskDistribution = async (req, res, next) => {
  try {
    const result = await getRiskDistribution();
    return successResponse(res, 200, "Risk distribution fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const transactionTrends = async (req, res, next) => {
  try {
    const result = await getTransactionTrends();
    return successResponse(res, 200, "Transaction trends fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const auditLogs = async (req, res, next) => {
  try {
    const result = await getAuditLogs({
      limit: req.query.limit,
      page: req.query.page,
      action: req.query.action
    });

    return successResponse(res, 200, "Audit logs fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const recentHighRiskTransactions = async (req, res, next) => {
  try {
    const result = await getRecentHighRiskTransactions();

    return successResponse(
      res,
      200,
      "Recent high-risk transactions fetched successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  adminStats,
  riskDistribution,
  transactionTrends,
  auditLogs,
  recentHighRiskTransactions
};