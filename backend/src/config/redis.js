const redis = require("redis");
const { EventEmitter } = require("events");
const env = require("./env");

let redisClient;
let redisPublisher;
let redisSubscriber;

// Simple in-memory fallback to keep local development usable without Redis.
// Supports only the subset of commands this app uses (pub/sub + recent alerts list).
const createMemoryRedis = () => {
  const emitter = new EventEmitter();
  const lists = new Map(); // key -> string[]
  const kv = new Map(); // key -> { value: string, expiresAt?: number }

  const api = {
    isMemory: true,
    async connect() {},
    async quit() {},
    on() {},

    async publish(channel, message) {
      queueMicrotask(() => emitter.emit(channel, message));
      return 1;
    },

    async subscribe(channel, handler) {
      emitter.on(channel, handler);
      return 1;
    },

    async lPush(key, value) {
      const arr = lists.get(key) || [];
      arr.unshift(String(value));
      lists.set(key, arr);
      return arr.length;
    },

    async lTrim(key, start, stop) {
      const arr = lists.get(key) || [];
      const s = Math.max(0, Number(start) || 0);
      const e = Number(stop);
      const trimmed = arr.slice(s, e >= 0 ? e + 1 : undefined);
      lists.set(key, trimmed);
      return "OK";
    },

    async lRange(key, start, stop) {
      const arr = lists.get(key) || [];
      const s = Math.max(0, Number(start) || 0);
      const e = Number(stop);
      return arr.slice(s, e >= 0 ? e + 1 : undefined);
    },

    async get(key) {
      const item = kv.get(String(key));
      if (!item) return null;
      if (item.expiresAt && Date.now() > item.expiresAt) {
        kv.delete(String(key));
        return null;
      }
      return item.value;
    },

    async setEx(key, ttlSeconds, value) {
      const k = String(key);
      const ttl = Math.max(0, Number(ttlSeconds) || 0) * 1000;
      kv.set(k, { value: String(value), expiresAt: ttl ? Date.now() + ttl : undefined });
      return "OK";
    },

    async del(key) {
      kv.delete(String(key));
      lists.delete(String(key));
      return 1;
    }
  };

  return api;
};

const createRedisClient = () =>
  redis.createClient({
    url: env.REDIS_URL
  });

const connectRedis = async () => {
  const tryConnect = async () => {
    const client = createRedisClient();
    const publisher = createRedisClient();
    const subscriber = createRedisClient();

    client.on("error", (error) => {
      console.error("Redis client error:", error.message);
    });
    publisher.on("error", (error) => {
      console.error("Redis publisher error:", error.message);
    });
    subscriber.on("error", (error) => {
      console.error("Redis subscriber error:", error.message);
    });

    await client.connect();
    await publisher.connect();
    await subscriber.connect();

    return { client, publisher, subscriber };
  };

  try {
    const { client, publisher, subscriber } = await tryConnect();
    redisClient = client;
    redisPublisher = publisher;
    redisSubscriber = subscriber;

    console.log("Redis connected");
    return { redisClient, redisPublisher, redisSubscriber };
  } catch (error) {
    // Fallback for local dev if Redis isn't running.
    console.warn(
      "Redis unavailable - using in-memory fallback (ok for local dev).",
      error?.message || error
    );

    const mem = createMemoryRedis();
    redisClient = mem;
    redisPublisher = mem;
    redisSubscriber = mem;

    return { redisClient, redisPublisher, redisSubscriber };
  }
};

const getRedisClient = () => {
  if (!redisClient) throw new Error("Redis client is not initialized");
  return redisClient;
};

const getRedisPublisher = () => {
  if (!redisPublisher) throw new Error("Redis publisher is not initialized");
  return redisPublisher;
};

const getRedisSubscriber = () => {
  if (!redisSubscriber) throw new Error("Redis subscriber is not initialized");
  return redisSubscriber;
};

module.exports = {
  connectRedis,
  getRedisClient,
  getRedisPublisher,
  getRedisSubscriber
};
