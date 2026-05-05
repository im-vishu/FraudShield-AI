const prisma = require("../config/db");

const getAdminStats = async () => {
  const [
    totalUsers,
    totalTransactions,
    approvedTransactions,
    flaggedTransactions,
    blockedTransactions,
    totalAlerts,
    unresolvedAlerts,
    criticalAlerts
  ] = await Promise.all([
    prisma.user.count(),
    prisma.transaction.count(),
    prisma.transaction.count({ where: { status: "APPROVED" } }),
    prisma.transaction.count({ where: { status: "FLAGGED" } }),
    prisma.transaction.count({ where: { status: "BLOCKED" } }),
    prisma.fraudAlert.count(),
    prisma.fraudAlert.count({ where: { isResolved: false } }),
    prisma.fraudAlert.count({ where: { severity: "CRITICAL" } })
  ]);

  const fraudRate =
    totalTransactions === 0
      ? 0
      : Number((((flaggedTransactions + blockedTransactions) / totalTransactions) * 100).toFixed(2));

  return {
    users: {
      total: totalUsers
    },
    transactions: {
      total: totalTransactions,
      approved: approvedTransactions,
      flagged: flaggedTransactions,
      blocked: blockedTransactions,
      fraudRate
    },
    alerts: {
      total: totalAlerts,
      unresolved: unresolvedAlerts,
      critical: criticalAlerts
    }
  };
};

const getRiskDistribution = async () => {
  const [low, medium, high, critical] = await Promise.all([
    prisma.transaction.count({ where: { riskLevel: "LOW" } }),
    prisma.transaction.count({ where: { riskLevel: "MEDIUM" } }),
    prisma.transaction.count({ where: { riskLevel: "HIGH" } }),
    prisma.transaction.count({ where: { riskLevel: "CRITICAL" } })
  ]);

  return {
    LOW: low,
    MEDIUM: medium,
    HIGH: high,
    CRITICAL: critical
  };
};

const getTransactionTrends = async () => {
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const transactions = await prisma.transaction.findMany({
    where: {
      createdAt: {
        gte: last7Days
      }
    },
    select: {
      createdAt: true,
      status: true,
      riskScore: true
    },
    orderBy: {
      createdAt: "asc"
    }
  });

  const trendMap = {};

  transactions.forEach((txn) => {
    const date = txn.createdAt.toISOString().split("T")[0];

    if (!trendMap[date]) {
      trendMap[date] = {
        date,
        total: 0,
        approved: 0,
        flagged: 0,
        blocked: 0,
        averageRiskScore: 0,
        riskScoreSum: 0
      };
    }

    trendMap[date].total += 1;

    if (txn.status === "APPROVED") trendMap[date].approved += 1;
    if (txn.status === "FLAGGED") trendMap[date].flagged += 1;
    if (txn.status === "BLOCKED") trendMap[date].blocked += 1;

    trendMap[date].riskScoreSum += txn.riskScore;
  });

  return Object.values(trendMap).map((day) => ({
    date: day.date,
    total: day.total,
    approved: day.approved,
    flagged: day.flagged,
    blocked: day.blocked,
    averageRiskScore: Number((day.riskScoreSum / day.total).toFixed(2))
  }));
};

const getAuditLogs = async ({ limit = 20, page = 1, action }) => {
  const take = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {};

  if (action) {
    where.action = action;
  }

  const [logs, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      },
      take,
      skip
    }),
    prisma.auditLog.count({ where })
  ]);

  return {
    logs,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      pages: Math.ceil(total / take)
    }
  };
};

const getRecentHighRiskTransactions = async () => {
  return prisma.transaction.findMany({
    where: {
      riskScore: {
        gte: 70
      }
    },
    orderBy: {
      createdAt: "desc"
    },
    take: 10,
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
  });
};

module.exports = {
  getAdminStats,
  getRiskDistribution,
  getTransactionTrends,
  getAuditLogs,
  getRecentHighRiskTransactions
};