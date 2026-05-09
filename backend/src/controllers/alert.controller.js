const {
  listAlerts,
  getRecentRedisAlerts,
  updateAlertStatus
} = require("../services/alert.service");
const { successResponse } = require("../utils/apiResponse");

const getAlerts = async (req, res, next) => {
  try {
    const result = await listAlerts({
      limit: req.query.limit,
      page: req.query.page,
      severity: req.query.severity,
      isResolved: req.query.isResolved,
      status: req.query.status
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

const investigateAlert = async (req, res, next) => {
  try {
    const alert = await updateAlertStatus({
      alertId: req.params.alertId,
      status: "INVESTIGATING",
      userId: req.user.id
    });

    return successResponse(res, 200, "Alert marked investigating", { alert });
  } catch (error) {
    next(error);
  }
};

const dismissAlert = async (req, res, next) => {
  try {
    const dismissReason =
      typeof req.body?.reason === "string" ? req.body.reason : null;

    const alert = await updateAlertStatus({
      alertId: req.params.alertId,
      status: "DISMISSED",
      userId: req.user.id,
      dismissReason
    });

    return successResponse(res, 200, "Alert dismissed", { alert });
  } catch (error) {
    next(error);
  }
};

const resolveAlert = async (req, res, next) => {
  try {
    const alert = await updateAlertStatus({
      alertId: req.params.alertId,
      status: "RESOLVED",
      userId: req.user.id
    });

    return successResponse(res, 200, "Alert resolved", { alert });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAlerts,
  getRecentAlerts,
  investigateAlert,
  dismissAlert,
  resolveAlert
};
