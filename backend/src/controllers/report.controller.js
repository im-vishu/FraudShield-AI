const { successResponse } = require("../utils/apiResponse");
const { listReports, getReportDetail } = require("../services/report.service");

const getReports = async (req, res, next) => {
  try {
    const result = await listReports({
      user: req.user,
      limit: req.query.limit,
      page: req.query.page
    });

    return successResponse(res, 200, "Reports fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const getReport = async (req, res, next) => {
  try {
    const result = await getReportDetail({
      user: req.user,
      id: req.params.id
    });

    return successResponse(res, 200, "Report fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReports,
  getReport
};

