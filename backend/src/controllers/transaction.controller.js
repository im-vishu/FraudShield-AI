const {
  analyzeAndStoreTransaction,
  listTransactions
} = require("../services/transaction.service");
const { analyzeTransactionSchema } = require("../schemas/transaction.schema");
const { successResponse } = require("../utils/apiResponse");

const analyzeTransaction = async (req, res, next) => {
  try {
    const { value, error } = analyzeTransactionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationError = new Error(
        error.details.map((detail) => detail.message).join(", ")
      );
      validationError.statusCode = 400;
      throw validationError;
    }

    const result = await analyzeAndStoreTransaction({
      userId: req.user.id,
      payload: value,
      ipAddress: req.ip
    });

    return successResponse(
      res,
      201,
      "Transaction analyzed successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const result = await listTransactions({
      user: req.user,
      limit: req.query.limit,
      page: req.query.page
    });

    return successResponse(res, 200, "Transactions fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeTransaction,
  getTransactions
};