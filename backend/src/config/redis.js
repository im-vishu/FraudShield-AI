const redis = require("redis");
const env = require("./env");

let redisClient;

const connectRedis = async () => {
  redisClient = redis.createClient({
    url: env.REDIS_URL
  });

  redisClient.on("error", (error) => {
    console.error("❌ Redis error:", error.message);
  });

  redisClient.on("connect", () => {
    console.log("✅ Redis connected");
  });

  await redisClient.connect();
  return redisClient;
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client is not initialized");
  }

  return redisClient;
};

module.exports = {
  connectRedis,
  getRedisClient
};