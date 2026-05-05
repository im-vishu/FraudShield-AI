const axios = require("axios");
const prisma = require("../config/db");
const env = require("../config/env");
const { getRedisClient } = require("../config/redis");

const CACHE_TTL_SECONDS = 60 * 60 * 6;

const calculateIpRiskScore = ({ abuseConfidence = 0, isBlacklisted = false }) => {
  let score = 0;

  if (abuseConfidence >= 90) score += 40;
  else if (abuseConfidence >= 70) score += 30;
  else if (abuseConfidence >= 40) score += 18;
  else if (abuseConfidence >= 20) score += 10;

  if (isBlacklisted) score += 20;

  return Math.min(score, 60);
};

const checkAbuseIPDB = async (ipAddress) => {
  if (!env.ABUSEIPDB_API_KEY) {
    return {
      enabled: false,
      source: "AbuseIPDB",
      abuseConfidence: 0,
      raw: null
    };
  }

  const response = await axios.get("https://api.abuseipdb.com/api/v2/check", {
    params: {
      ipAddress,
      maxAgeInDays: 90,
      verbose: true
    },
    headers: {
      Key: env.ABUSEIPDB_API_KEY,
      Accept: "application/json"
    },
    timeout: 5000
  });

  const data = response.data.data;

  return {
    enabled: true,
    source: "AbuseIPDB",
    abuseConfidence: data.abuseConfidenceScore || 0,
    countryCode: data.countryCode || null,
    isp: data.isp || null,
    usageType: data.usageType || null,
    raw: data
  };
};

const checkIPinfo = async (ipAddress) => {
  if (!env.IPINFO_TOKEN) {
    return {
      enabled: false,
      source: "IPinfo",
      raw: null
    };
  }

  const response = await axios.get(`https://ipinfo.io/${ipAddress}/json`, {
    params: {
      token: env.IPINFO_TOKEN
    },
    timeout: 5000
  });

  return {
    enabled: true,
    source: "IPinfo",
    countryCode: response.data.country || null,
    city: response.data.city || null,
    region: response.data.region || null,
    org: response.data.org || null,
    loc: response.data.loc || null,
    raw: response.data
  };
};

const checkIpApiFallback = async (ipAddress) => {
  const response = await axios.get(`http://ip-api.com/json/${ipAddress}`, {
    params: {
      fields: "status,message,query,country,countryCode,regionName,city,isp,org,as,proxy,hosting"
    },
    timeout: 5000
  });

  if (response.data.status !== "success") {
    return {
      enabled: true,
      source: "ip-api",
      error: response.data.message || "ip-api lookup failed",
      raw: response.data
    };
  }

  return {
    enabled: true,
    source: "ip-api",
    countryCode: response.data.countryCode || null,
    city: response.data.city || null,
    region: response.data.regionName || null,
    isp: response.data.isp || null,
    org: response.data.org || null,
    proxy: Boolean(response.data.proxy),
    hosting: Boolean(response.data.hosting),
    raw: response.data
  };
};

const checkIPReputation = async (ipAddress) => {
  const redis = getRedisClient();
  const cacheKey = `ip-reputation:${ipAddress}`;

  const cached = await redis.get(cacheKey);

  if (cached) {
    return {
      ...JSON.parse(cached),
      cached: true
    };
  }

  let abuseResult = {
    enabled: false,
    source: "AbuseIPDB",
    abuseConfidence: 0,
    raw: null
  };

  let ipinfoResult = {
    enabled: false,
    source: "IPinfo",
    raw: null
  };

  let fallbackResult = {
    enabled: false,
    source: "ip-api",
    raw: null
  };

  try {
    abuseResult = await checkAbuseIPDB(ipAddress);
  } catch (error) {
    abuseResult = {
      enabled: true,
      source: "AbuseIPDB",
      error: error.message,
      abuseConfidence: 0,
      raw: null
    };
  }

  try {
    ipinfoResult = await checkIPinfo(ipAddress);
  } catch (error) {
    ipinfoResult = {
      enabled: true,
      source: "IPinfo",
      error: error.message,
      raw: null
    };
  }

  try {
    fallbackResult = await checkIpApiFallback(ipAddress);
  } catch (error) {
    fallbackResult = {
      enabled: true,
      source: "ip-api",
      error: error.message,
      raw: null
    };
  }

  const abuseConfidence = abuseResult.abuseConfidence || 0;

  const isBlacklisted =
    abuseConfidence >= 75 ||
    fallbackResult.proxy === true ||
    fallbackResult.hosting === true;

  const riskScore = calculateIpRiskScore({
    abuseConfidence,
    isBlacklisted
  });

  const result = {
    ipAddress,
    abuseConfidence,
    isBlacklisted,
    riskScore,
    countryCode:
      abuseResult.countryCode ||
      ipinfoResult.countryCode ||
      fallbackResult.countryCode ||
      null,
    city: ipinfoResult.city || fallbackResult.city || null,
    isp: abuseResult.isp || fallbackResult.isp || ipinfoResult.org || null,
    sources: {
      abuseipdb: abuseResult,
      ipinfo: ipinfoResult,
      ipApi: fallbackResult
    },
    checkedAt: new Date().toISOString(),
    cached: false
  };

  await prisma.iPReputation.upsert({
    where: {
      ipAddress
    },
    update: {
      abuseConfidence: result.abuseConfidence,
      countryCode: result.countryCode,
      city: result.city,
      isp: result.isp,
      isBlacklisted: result.isBlacklisted,
      source: "AbuseIPDB/IPinfo/ip-api",
      rawData: result.sources,
      lastCheckedAt: new Date()
    },
    create: {
      ipAddress,
      abuseConfidence: result.abuseConfidence,
      countryCode: result.countryCode,
      city: result.city,
      isp: result.isp,
      isBlacklisted: result.isBlacklisted,
      source: "AbuseIPDB/IPinfo/ip-api",
      rawData: result.sources
    }
  });

  await redis.setEx(cacheKey, CACHE_TTL_SECONDS, JSON.stringify(result));

  return result;
};

module.exports = {
  checkIPReputation
};