const prisma = require("../config/db");
const { analyzeFraudRisk } = require("../ml/fraudModel");
const { getRiskContext } = require("./riskContext.service");
const { checkIPReputation } = require("./ipReputation.service");
const { publishFraudAlert } = require("./alertPublisher.service");

const createFraudAlertIfNeeded = async ({ transaction, riskResult }) => {
  if (riskResult.riskScore < 70) return null;

  const severity =
    riskResult.riskScore >= 85
      ? "CRITICAL"
      : riskResult.riskScore >= 70
        ? "HIGH"
        : "MEDIUM";

  return prisma.fraudAlert.create({
    data: {
      transactionId: transaction.id,
      severity,
      title: `${severity} fraud risk detected`,
      message: `Transaction ${transaction.transactionRef} received fraud risk score ${riskResult.riskScore}`,
      metadata: {
        riskScore: riskResult.riskScore,
        riskLevel: riskResult.riskLevel,
        ruleSignals: riskResult.ruleSignals,
        behaviorSignals: riskResult.behaviorSignals,
        ipSignals: riskResult.ipSignals,
        mlSignals: riskResult.mlSignals,
        apiSignals: riskResult.apiSignals,
        explanation: riskResult.explanation
      }
    }
  });
};

const analyzeAndStoreTransaction = async ({ userId, payload, ipAddress }) => {
  const context = await getRiskContext({
    userId,
    payload
  });

  if (payload.ipAddress) {
    context.ipReputation = await checkIPReputation(payload.ipAddress);
  }

  const riskResult = analyzeFraudRisk(payload, context);

  const transaction = await prisma.transaction.create({
    data: {
      userId,
      transactionRef: payload.transactionRef,
      amount: payload.amount,
      currency: payload.currency || "INR",
      senderAccount: payload.senderAccount || null,
      receiverAccount: payload.receiverAccount || null,
      ipAddress: payload.ipAddress || ipAddress || null,
      deviceId: payload.deviceId || null,
      location: payload.location || null,
      riskScore: riskResult.riskScore,
      riskLevel: riskResult.riskLevel,
      status: riskResult.status,
      ruleSignals: {
        rules: riskResult.ruleSignals,
        behavior: riskResult.behaviorSignals,
        ipSignals: riskResult.ipSignals,
        explanation: riskResult.explanation,
        context
      },
      apiSignals: riskResult.apiSignals,
      mlSignals: riskResult.mlSignals
    }
  });

  const fraudAlert = await createFraudAlertIfNeeded({
    transaction,
    riskResult
  });

  const publishedAlert = await publishFraudAlert({
    transaction,
    fraudAlert,
    riskResult
  });

  await prisma.auditLog.create({
    data: {
      userId,
      action: "TRANSACTION_ANALYZED",
      entity: "Transaction",
      entityId: transaction.id,
      ipAddress,
      metadata: {
        transactionRef: transaction.transactionRef,
        riskScore: transaction.riskScore,
        riskLevel: transaction.riskLevel,
        status: transaction.status,
        apiSignals: riskResult.apiSignals,
        explanation: riskResult.explanation,
        publishedAlert
      }
    }
  });

  return {
    transaction,
    fraudAlert,
    publishedAlert,
    riskExplanation: riskResult.explanation
  };
};

const listTransactions = async ({ user, limit = 20, page = 1 }) => {
  const take = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where =
    user.role === "ADMIN" || user.role === "ANALYST"
      ? {}
      : { userId: user.id };

  const [transactions, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: {
        createdAt: "desc"
      },
      take,
      skip,
      include: {
        fraudAlerts: true,
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      }
    }),
    prisma.transaction.count({ where })
  ]);

  return {
    transactions,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      pages: Math.ceil(total / take)
    }
  };
};

const getTransactionById = async ({ user, id }) => {
  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: { fraudAlerts: true, user: true }
  });

  if (!tx) {
    const error = new Error("Transaction not found");
    error.statusCode = 404;
    throw error;
  }

  const isAdmin = user.role === "ADMIN" || user.role === "ANALYST";
  if (!isAdmin && tx.userId !== user.id) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  return tx;
};

module.exports = {
  analyzeAndStoreTransaction,
  listTransactions,
  getTransactionById
};
