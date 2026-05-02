const prisma = require("../config/db");
const { getRedisClient } = require("../config/redis");
const { successResponse } = require("../utils/apiResponse");

const healthCheck = async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;

    const redisClient = getRedisClient();
    await redisClient.ping();

    return successResponse(res, 200, "FraudShield AI backend is running", {
      api: "healthy",
      database: "connected",
      redis: "connected",
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  healthCheck
};