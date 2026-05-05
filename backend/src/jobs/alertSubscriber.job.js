const { getRedisSubscriber } = require("../config/redis");
const { ALERT_CHANNELS } = require("../services/alertPublisher.service");

const startAlertSubscriber = async () => {
  const subscriber = getRedisSubscriber();

  await subscriber.subscribe(ALERT_CHANNELS.ALL, (message) => {
    const alert = JSON.parse(message);

    console.log("\n🚨 REAL-TIME FRAUD ALERT");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Severity: ${alert.severity}`);
    console.log(`Transaction: ${alert.transactionRef}`);
    console.log(`Risk Score: ${alert.riskScore}`);
    console.log(`Status: ${alert.status}`);
    console.log(`Message: ${alert.message}`);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");
  });

  await subscriber.subscribe(ALERT_CHANNELS.CRITICAL, (message) => {
    const alert = JSON.parse(message);

    console.log("\n🔥 CRITICAL FRAUD ALERT CHANNEL");
    console.log(`Transaction: ${alert.transactionRef}`);
    console.log(`Risk Score: ${alert.riskScore}`);
    console.log(`IP: ${alert.ipAddress || "N/A"}`);
    console.log("\n");
  });

  console.log("📡 Redis fraud alert subscriber is listening");
};

module.exports = {
  startAlertSubscriber
};