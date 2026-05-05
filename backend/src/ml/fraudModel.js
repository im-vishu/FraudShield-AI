const getRiskLevel = (riskScore) => {
  if (riskScore >= 85) return "CRITICAL";
  if (riskScore >= 70) return "HIGH";
  if (riskScore >= 40) return "MEDIUM";
  return "LOW";
};

const getTransactionStatus = (riskScore) => {
  if (riskScore >= 85) return "BLOCKED";
  if (riskScore >= 70) return "FLAGGED";
  if (riskScore >= 40) return "PENDING";
  return "APPROVED";
};

const calculateRuleBasedRisk = (transaction) => {
  let score = 0;
  const signals = [];

  if (transaction.amount >= 100000) {
    score += 30;
    signals.push({
      signal: "HIGH_AMOUNT",
      points: 30,
      message: "Transaction amount is above ₹1,00,000"
    });
  } else if (transaction.amount >= 50000) {
    score += 18;
    signals.push({
      signal: "ELEVATED_AMOUNT",
      points: 18,
      message: "Transaction amount is above ₹50,000"
    });
  }

  const txnDate = transaction.transactionTime
    ? new Date(transaction.transactionTime)
    : new Date();

  const hour = txnDate.getHours();

  if (hour >= 0 && hour <= 5) {
    score += 20;
    signals.push({
      signal: "ODD_HOUR",
      points: 20,
      message: "Transaction happened during unusual hours"
    });
  }

  if (!transaction.deviceId) {
    score += 10;
    signals.push({
      signal: "MISSING_DEVICE_ID",
      points: 10,
      message: "Device ID is missing"
    });
  }

  if (!transaction.ipAddress) {
    score += 10;
    signals.push({
      signal: "MISSING_IP",
      points: 10,
      message: "IP address is missing"
    });
  }

  if (transaction.ipAddress && transaction.ipAddress.startsWith("10.")) {
    score += 15;
    signals.push({
      signal: "PRIVATE_NETWORK_IP",
      points: 15,
      message: "Private network IP detected"
    });
  }

  return {
    score: Math.min(score, 100),
    signals
  };
};

const calculateBehaviorRisk = (transaction, context = {}) => {
  let score = 0;
  const signals = [];

  if (context.recentUserTransactionCount >= 5) {
    score += 25;
    signals.push({
      signal: "HIGH_FREQUENCY_10_MIN",
      points: 25,
      message: "User made 5 or more transactions in the last 10 minutes"
    });
  } else if (context.recentUserTransactionCount >= 3) {
    score += 15;
    signals.push({
      signal: "ELEVATED_FREQUENCY_10_MIN",
      points: 15,
      message: "User made multiple transactions in the last 10 minutes"
    });
  }

  if (context.dailyUserTransactionCount >= 20) {
    score += 20;
    signals.push({
      signal: "HIGH_DAILY_VOLUME",
      points: 20,
      message: "User has unusually high transaction count in 24 hours"
    });
  }

  if (context.sameDeviceUsedByOtherUsersCount >= 3) {
    score += 25;
    signals.push({
      signal: "DEVICE_SHARED_BY_MULTIPLE_USERS",
      points: 25,
      message: "Same device was used by multiple other users"
    });
  }

  if (context.sameIpTransactionCount24h >= 10) {
    score += 20;
    signals.push({
      signal: "HIGH_IP_ACTIVITY",
      points: 20,
      message: "Same IP has high transaction activity in 24 hours"
    });
  }

  return {
    score: Math.min(score, 100),
    signals
  };
};

const calculateAdvancedMLRisk = (transaction, context = {}) => {
  let score = 0;
  const signals = [];

  const amount = Number(transaction.amount);
  const averageAmount = context.userAverageAmount30d || 5000;
  const ratio = amount / Math.max(averageAmount, 1);

  if (context.userTransactionCount30d >= 3 && ratio >= 10) {
    score += 30;
    signals.push({
      signal: "USER_AMOUNT_ANOMALY_EXTREME",
      points: 30,
      amountRatio: Number(ratio.toFixed(2)),
      message: "Transaction amount is extremely higher than user's normal behavior"
    });
  } else if (context.userTransactionCount30d >= 3 && ratio >= 5) {
    score += 18;
    signals.push({
      signal: "USER_AMOUNT_ANOMALY",
      points: 18,
      amountRatio: Number(ratio.toFixed(2)),
      message: "Transaction amount is higher than user's normal behavior"
    });
  }

  const globalAverageAmount = 5000;
  const globalStdDev = 15000;
  const zScore = Math.abs((amount - globalAverageAmount) / globalStdDev);

  if (zScore >= 5) {
    score += 30;
    signals.push({
      signal: "ML_AMOUNT_ANOMALY_EXTREME",
      points: 30,
      zScore: Number(zScore.toFixed(2)),
      message: "Global amount anomaly detected"
    });
  } else if (zScore >= 3) {
    score += 18;
    signals.push({
      signal: "ML_AMOUNT_ANOMALY",
      points: 18,
      zScore: Number(zScore.toFixed(2)),
      message: "Moderate global amount anomaly detected"
    });
  }

  return {
    score: Math.min(score, 100),
    signals,
    model: "advanced-behavior-z-score-v2"
  };
};

const buildRiskExplanation = ({
  riskScore,
  riskLevel,
  ruleSignals,
  behaviorSignals,
  mlSignals,
  ipSignals
}) => {
  const allSignals = [
    ...ruleSignals,
    ...behaviorSignals,
    ...(mlSignals.signals || []),
    ...ipSignals
  ];

  if (allSignals.length === 0) {
    return {
      summary: "No suspicious fraud indicators detected.",
      reasons: []
    };
  }

  return {
    summary: `${riskLevel} risk transaction with score ${riskScore}/100.`,
    reasons: allSignals.map((signal) => ({
      signal: signal.signal,
      points: signal.points,
      message: signal.message || "Risk signal detected"
    }))
  };
};

const buildIpSignals = (ipReputation) => {
  if (!ipReputation) return [];

  const signals = [];

  if (ipReputation.abuseConfidence >= 75) {
    signals.push({
      signal: "HIGH_ABUSE_IP_CONFIDENCE",
      points: ipReputation.riskScore || 0,
      message: `IP has high AbuseIPDB confidence score: ${ipReputation.abuseConfidence}`
    });
  } else if (ipReputation.abuseConfidence >= 40) {
    signals.push({
      signal: "MEDIUM_ABUSE_IP_CONFIDENCE",
      points: ipReputation.riskScore || 0,
      message: `IP has moderate AbuseIPDB confidence score: ${ipReputation.abuseConfidence}`
    });
  }

  if (ipReputation.isBlacklisted) {
    signals.push({
      signal: "BLACKLISTED_OR_RISKY_IP",
      points: 20,
      message: "IP is blacklisted, proxy, hosting, or risky"
    });
  }

  return signals;
};

const analyzeFraudRisk = (transaction, context = {}) => {
  const ruleRisk = calculateRuleBasedRisk(transaction);
  const behaviorRisk = calculateBehaviorRisk(transaction, context);
  const mlRisk = calculateAdvancedMLRisk(transaction, context);

  const ipRiskScore = context.ipReputation?.riskScore || 0;
  const ipSignals = buildIpSignals(context.ipReputation);

  const riskScore = Math.min(
    ruleRisk.score + behaviorRisk.score + mlRisk.score + ipRiskScore,
    100
  );

  const riskLevel = getRiskLevel(riskScore);
  const status = getTransactionStatus(riskScore);

  const explanation = buildRiskExplanation({
    riskScore,
    riskLevel,
    ruleSignals: ruleRisk.signals,
    behaviorSignals: behaviorRisk.signals,
    mlSignals: mlRisk,
    ipSignals
  });

  return {
    riskScore,
    riskLevel,
    status,
    ruleSignals: ruleRisk.signals,
    behaviorSignals: behaviorRisk.signals,
    ipSignals,
    mlSignals: mlRisk,
    explanation,
    apiSignals: context.ipReputation || {
      enabled: false,
      message: "No IP reputation data available"
    }
  };
};

module.exports = {
  analyzeFraudRisk,
  getRiskLevel,
  getTransactionStatus
};