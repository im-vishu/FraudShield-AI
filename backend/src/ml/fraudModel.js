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

const calculateBasicMLRisk = (transaction) => {
  let score = 0;
  const signals = [];

  const amount = Number(transaction.amount);

  const assumedAverageAmount = 5000;
  const assumedStdDev = 15000;

  const zScore = Math.abs((amount - assumedAverageAmount) / assumedStdDev);

  if (zScore >= 5) {
    score += 30;
    signals.push({
      signal: "ML_AMOUNT_ANOMALY_EXTREME",
      points: 30,
      zScore: Number(zScore.toFixed(2))
    });
  } else if (zScore >= 3) {
    score += 18;
    signals.push({
      signal: "ML_AMOUNT_ANOMALY",
      points: 18,
      zScore: Number(zScore.toFixed(2))
    });
  }

  return {
    score: Math.min(score, 100),
    signals,
    model: "basic-z-score-v1"
  };
};

const analyzeFraudRisk = (transaction) => {
  const ruleRisk = calculateRuleBasedRisk(transaction);
  const mlRisk = calculateBasicMLRisk(transaction);

  const riskScore = Math.min(ruleRisk.score + mlRisk.score, 100);
  const riskLevel = getRiskLevel(riskScore);
  const status = getTransactionStatus(riskScore);

  return {
    riskScore,
    riskLevel,
    status,
    ruleSignals: ruleRisk.signals,
    mlSignals: mlRisk,
    apiSignals: {
      enabled: false,
      message: "External IP intelligence will be added in Phase 6"
    }
  };
};

module.exports = {
  analyzeFraudRisk,
  getRiskLevel,
  getTransactionStatus
};