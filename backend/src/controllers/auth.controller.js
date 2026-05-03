const { registerUser, loginUser } = require("../services/auth.service");
const { successResponse } = require("../utils/apiResponse");
const { registerSchema, loginSchema } = require("../schemas/auth.schema");

const register = async (req, res, next) => {
  try {
    const { value, error } = registerSchema.validate(req.body, {
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

    const result = await registerUser(value);

    return successResponse(res, 201, "User registered successfully", result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { value, error } = loginSchema.validate(req.body, {
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

    const result = await loginUser({
      ...value,
      ipAddress: req.ip
    });

    return successResponse(res, 200, "Login successful", result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login
};