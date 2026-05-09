const prisma = require("../config/db");
const { buildTrace } = require("./trace.service");

const listReports = async ({ user, limit = 20, page = 1 }) => {
  const take = Math.min(Number(limit) || 20, 100);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where =
    user.role === "ADMIN" || user.role === "ANALYST"
      ? { fraudAlerts: { some: {} } }
      : { userId: user.id, fraudAlerts: { some: {} } };

  const [txs, total] = await Promise.all([
    prisma.transaction.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take,
      skip,
      include: { fraudAlerts: true }
    }),
    prisma.transaction.count({ where })
  ]);

  const reports = txs.map((t) => {
    const severities = t.fraudAlerts.map((a) => a.severity);
    const severityRank = (s) =>
      s === "CRITICAL" ? 4 : s === "HIGH" ? 3 : s === "MEDIUM" ? 2 : 1;
    const topSeverity =
      severities.sort((a, b) => severityRank(b) - severityRank(a))[0] || "LOW";

    const statusCounts = t.fraudAlerts.reduce((acc, a) => {
      const k = a.status || "NEW";
      acc[k] = (acc[k] || 0) + 1;
      return acc;
    }, {});

    return {
      id: t.id,
      transactionId: t.id,
      transactionRef: t.transactionRef,
      createdAt: t.createdAt,
      amount: t.amount,
      currency: t.currency,
      riskScore: t.riskScore,
      riskLevel: t.riskLevel,
      status: t.status,
      location: t.location,
      alertCount: t.fraudAlerts.length,
      topSeverity,
      statusCounts
    };
  });

  return {
    reports,
    pagination: {
      total,
      page: Number(page),
      limit: take,
      pages: Math.ceil(total / take)
    }
  };
};

const getReportDetail = async ({ user, id }) => {
  const tx = await prisma.transaction.findUnique({
    where: { id },
    include: { fraudAlerts: true, user: true }
  });

  if (!tx) {
    const error = new Error("Report not found");
    error.statusCode = 404;
    throw error;
  }

  const isAdmin = user.role === "ADMIN" || user.role === "ANALYST";
  if (!isAdmin && tx.userId !== user.id) {
    const error = new Error("Access denied");
    error.statusCode = 403;
    throw error;
  }

  const trace = buildTrace({
    transactionId: tx.id,
    location: tx.location,
    ipAddress: tx.ipAddress
  });

  const statusCounts = tx.fraudAlerts.reduce((acc, a) => {
    const k = a.status || "NEW";
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  const traceSummary = {
    originCity: trace.originCity,
    destinationCity: trace.destinationCity,
    hopCount: trace.points.length,
    note:
      tx.ipAddress
        ? `Trace seeded by transaction id + IP (${tx.ipAddress}).`
        : "Trace seeded by transaction id."
  };

  // Hotspots: use trace nodes + a couple extra deterministic points as a simple overlay.
  const hotspots = [
    ...trace.nodes.map((n) => ({
      id: n.id,
      city: n.city,
      lng: n.lng,
      lat: n.lat,
      weight: n.id === "origin" ? 0.9 : 0.75
    })),
    {
      id: "mid",
      city: "Midpoint",
      lng: (trace.nodes[0].lng + trace.nodes[1].lng) / 2,
      lat: (trace.nodes[0].lat + trace.nodes[1].lat) / 2,
      weight: 0.55
    }
  ];

  const kpis = {
    riskScore: tx.riskScore,
    riskLevel: tx.riskLevel,
    amount: tx.amount,
    currency: tx.currency,
    alertCount: tx.fraudAlerts.length,
    statusCounts
  };

  return {
    report: {
      id: tx.id,
      transactionRef: tx.transactionRef,
      createdAt: tx.createdAt,
      location: tx.location,
      ipAddress: tx.ipAddress,
      deviceId: tx.deviceId
    },
    transaction: tx,
    kpis,
    traceSummary,
    map: {
      nodes: trace.nodes,
      path: trace.points,
      hotspots
    }
  };
};

module.exports = {
  listReports,
  getReportDetail
};

