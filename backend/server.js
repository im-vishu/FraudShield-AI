const app = require("./src/app");
const env = require("./src/config/env");
const prisma = require("./src/config/db");
const { connectRedis } = require("./src/config/redis");
const { startAlertSubscriber } = require("./src/jobs/alertSubscriber.job");

let server;

const shutdown = async (signal) => {
  console.log(`\n${signal} received. Shutting down gracefully...`);

  if (server) {
    server.close(async () => {
      console.log("HTTP server closed");

      try {
        await prisma.$disconnect();
        console.log("Database disconnected");
        process.exit(0);
      } catch (error) {
        console.error("Shutdown error:", error.message);
        process.exit(1);
      }
    });
  }
};

const startServer = async () => {
  try {
    await prisma.$connect();
    await connectRedis();
    await startAlertSubscriber();

    server = app.listen(env.PORT, () => {
      console.log(`🚀 FraudShield AI backend running on port ${env.PORT}`);
      console.log(`🌍 Environment: ${env.NODE_ENV}`);
    });

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();