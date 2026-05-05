const {
  listAlerts,
  getRecentRedisAlerts
} = require("../services/alert.service");
const { successResponse } = require("../utils/apiResponse");

const getAlerts = async (req, res, next) => {
  try {
    const result = await listAlerts({
      limit: req.query.limit,
      page: req.query.page,
      severity: req.query.severity,
      isResolved: req.query.isResolved
    });

    return successResponse(res, 200, "Alerts fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const getRecentAlerts = async (req, res, next) => {
  try {
    const result = await getRecentRedisAlerts();

    return successResponse(
      res,
      200,
      "Recent real-time alerts fetched successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  getRecentAlerts
};