const { ipCheckSchema } = require("../schemas/ip.schema");
const { checkIPReputation } = require("../services/ipReputation.service");
const { successResponse } = require("../utils/apiResponse");

const checkIP = async (req, res, next) => {
  try {
    const { value, error } = ipCheckSchema.validate(req.body, {
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

    const result = await checkIPReputation(value.ipAddress);

    return successResponse(res, 200, "IP reputation checked successfully", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkIP
};