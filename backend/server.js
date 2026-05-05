const app = require("./src/app");
const env = require("./src/config/env");
const { connectRedis } = require("./src/config/redis");
const { startAlertSubscriber } = require("./src/jobs/alertSubscriber.job");

const startServer = async () => {
  try {
    await connectRedis();

    await startAlertSubscriber();

    app.listen(env.PORT, () => {
      console.log(`🚀 FraudShield AI backend running on port ${env.PORT}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();