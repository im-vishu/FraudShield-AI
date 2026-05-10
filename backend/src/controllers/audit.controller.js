const { successResponse } = require("../utils/apiResponse");
const { listAuditLogs: listAuditLogsSvc } = require("../services/audit.service");

const listAuditLogs = async (req, res, next) => {
  try {
    const result = await listAuditLogsSvc({
      user: req.user,
      limit: req.query.limit,
      page: req.query.page,
      action: req.query.action
    });

    return successResponse(res, 200, "Audit logs fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listAuditLogs
};

