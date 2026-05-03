require("dotenv").config();

const requiredEnvVars = ["DATABASE_URL", "JWT_SECRET"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    console.warn(`⚠️ Missing environment variable: ${key}`);
  }
});


module.exports = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: Number(process.env.PORT) || 5000,

  DATABASE_URL: process.env.DATABASE_URL,

  REDIS_URL: process.env.REDIS_URL || "redis://localhost:6379",

  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  ABUSEIPDB_API_KEY: process.env.ABUSEIPDB_API_KEY || "",
  IPINFO_TOKEN: process.env.IPINFO_TOKEN || ""
};