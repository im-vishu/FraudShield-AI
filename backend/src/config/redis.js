const redis = require("redis");
const env = require("./env");

let redisClient;
let redisPublisher;
let redisSubscriber;

const createRedisClient = () => {
  return redis.createClient({
    url: env.REDIS_URL
  });
};

const connectRedis = async () => {
  redisClient = createRedisClient();
  redisPublisher = createRedisClient();
  redisSubscriber = createRedisClient();

  redisClient.on("error", (error) => {
    console.error("❌ Redis client error:", error.message);
  });

  redisPublisher.on("error", (error) => {
    console.error("❌ Redis publisher error:", error.message);
  });

  redisSubscriber.on("error", (error) => {
    console.error("❌ Redis subscriber error:", error.message);
  });

  await redisClient.connect();
  await redisPublisher.connect();
  await redisSubscriber.connect();

  console.log("✅ Redis connected");

  return {
    redisClient,
    redisPublisher,
    redisSubscriber
  };
};

const getRedisClient = () => {
  if (!redisClient) {
    throw new Error("Redis client is not initialized");
  }

  return redisClient;
};

const getRedisPublisher = () => {
  if (!redisPublisher) {
    throw new Error("Redis publisher is not initialized");
  }

  return redisPublisher;
};

const getRedisSubscriber = () => {
  if (!redisSubscriber) {
    throw new Error("Redis subscriber is not initialized");
  }

  return redisSubscriber;
};

module.exports = {
  connectRedis,
  getRedisClient,
  getRedisPublisher,
  getRedisSubscriber
};