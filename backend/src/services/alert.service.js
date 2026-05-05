const prisma = require("../config/db");
const { getRedisClient } = require("../config/redis");
const { RECENT_ALERTS_KEY } = require("./alertPublisher.service");

const listAlerts = async ({ limit = 20, page = 1, severity, isResolved }) => {
  const take = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {};

  if (severity) {
    where.severity = severity;
  }

  if (isResolved !== undefined) {
    where.isResolved = isResolved === "true";
  }

  const [alerts, total] = await Promise.all([
    prisma.fraudAlert.findMany({
      where,
      include: {
        transaction: true
      },
      orderBy: {
        createdAt: "desc"
      },
      take,
      skip
    }),
    prisma.fraudAlert.count({
      where
    })
  ]);

  return {
    alerts,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      pages: Math.ceil(total / take)
    }
  };
};

const getRecentRedisAlerts = async () => {
  const redis = getRedisClient();

  const rawAlerts = await redis.lRange(RECENT_ALERTS_KEY, 0, 19);

  return rawAlerts.map((alert) => JSON.parse(alert));
};

module.exports = {
  listAlerts,
  getRecentRedisAlerts
};