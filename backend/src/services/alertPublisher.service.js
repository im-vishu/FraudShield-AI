const { getRedisPublisher, getRedisClient } = require("../config/redis");

const ALERT_CHANNELS = {
  ALL: "fraud-alerts",
  HIGH: "fraud-alerts:high",
  CRITICAL: "fraud-alerts:critical"
};

const RECENT_ALERTS_KEY = "fraud-alerts:recent";
const RECENT_ALERTS_LIMIT = 50;

const publishFraudAlert = async ({ transaction, fraudAlert, riskResult }) => {
  if (!fraudAlert) return null;

  const publisher = getRedisPublisher();
  const redis = getRedisClient();

  const payload = {
    alertId: fraudAlert.id,
    transactionId: transaction.id,
    transactionRef: transaction.transactionRef,
    severity: fraudAlert.severity,
    title: fraudAlert.title,
    message: fraudAlert.message,
    riskScore: riskResult.riskScore,
    riskLevel: riskResult.riskLevel,
    status: transaction.status,
    ipAddress: transaction.ipAddress,
    deviceId: transaction.deviceId,
    amount: transaction.amount.toString(),
    currency: transaction.currency,
    explanation: riskResult.explanation,
    createdAt: fraudAlert.createdAt
  };

  const serializedPayload = JSON.stringify(payload);

  await publisher.publish(ALERT_CHANNELS.ALL, serializedPayload);

  if (fraudAlert.severity === "HIGH") {
    await publisher.publish(ALERT_CHANNELS.HIGH, serializedPayload);
  }

  if (fraudAlert.severity === "CRITICAL") {
    await publisher.publish(ALERT_CHANNELS.CRITICAL, serializedPayload);
  }

  await redis.lPush(RECENT_ALERTS_KEY, serializedPayload);
  await redis.lTrim(RECENT_ALERTS_KEY, 0, RECENT_ALERTS_LIMIT - 1);

  return payload;
};

module.exports = {
  publishFraudAlert,
  ALERT_CHANNELS,
  RECENT_ALERTS_KEY
};