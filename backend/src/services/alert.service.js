const prisma = require("../config/db");
const { getRedisClient } = require("../config/redis");
const { RECENT_ALERTS_KEY } = require("./alertPublisher.service");

const listAlerts = async ({
  limit = 20,
  page = 1,
  severity,
  isResolved,
  status
}) => {
  const take = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {};

  if (severity) {
    where.severity = severity;
  }

  if (status) {
    where.status = status;
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

  const parsed = rawAlerts.map((alert) => JSON.parse(alert));

  // Ensure alert status reflects DB truth (redis payloads are immutable once pushed).
  const ids = parsed.map((a) => a.alertId).filter(Boolean);
  if (ids.length === 0) return parsed;

  const dbAlerts = await prisma.fraudAlert.findMany({
    where: { id: { in: ids } },
    select: { id: true, status: true, isResolved: true, dismissReason: true }
  });

  const byId = new Map(dbAlerts.map((a) => [a.id, a]));

  return parsed.map((a) => {
    const db = byId.get(a.alertId);
    if (!db) return a;

    return {
      ...a,
      alertStatus: db.status,
      isResolved: db.isResolved,
      dismissReason: db.dismissReason || a.dismissReason || null
    };
  });
};

const updateAlertStatus = async ({
  alertId,
  status,
  userId,
  dismissReason
}) => {
  const now = new Date();

  const updateData = {
    status,
    statusUpdatedAt: now,
    statusUpdatedByUserId: userId || null,
    dismissReason: dismissReason ?? null,
    isResolved: status === "RESOLVED",
    resolvedAt: status === "RESOLVED" ? now : null
  };

  return prisma.fraudAlert.update({
    where: { id: alertId },
    data: updateData,
    include: {
      transaction: true
    }
  });
};

module.exports = {
  listAlerts,
  getRecentRedisAlerts,
  updateAlertStatus
};
