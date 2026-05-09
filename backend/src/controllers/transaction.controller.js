const {
  analyzeAndStoreTransaction,
  listTransactions,
  getTransactionById
} = require("../services/transaction.service");
const { buildTrace } = require("../services/trace.service");
const { analyzeTransactionSchema } = require("../schemas/transaction.schema");
const { successResponse } = require("../utils/apiResponse");

const analyzeTransaction = async (req, res, next) => {
  try {
    const { value, error } = analyzeTransactionSchema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const validationError = new Error(
        error.details.map((detail) => detail.message).join(", ")
      );
      validationError.statusCode = 400;
      throw validationError;
    }

    const result = await analyzeAndStoreTransaction({
      userId: req.user.id,
      payload: value,
      ipAddress: req.ip
    });

    return successResponse(
      res,
      201,
      "Transaction analyzed successfully",
      result
    );
  } catch (error) {
    next(error);
  }
};

const getTransactions = async (req, res, next) => {
  try {
    const result = await listTransactions({
      user: req.user,
      limit: req.query.limit,
      page: req.query.page
    });

    return successResponse(res, 200, "Transactions fetched successfully", result);
  } catch (error) {
    next(error);
  }
};

const getTransaction = async (req, res, next) => {
  try {
    const transaction = await getTransactionById({
      user: req.user,
      id: req.params.id
    });

    return successResponse(res, 200, "Transaction fetched successfully", {
      transaction
    });
  } catch (error) {
    next(error);
  }
};

const getTransactionTrace = async (req, res, next) => {
  try {
    const transaction = await getTransactionById({
      user: req.user,
      id: req.params.id
    });

    const trace = buildTrace({
      transactionId: transaction.id,
      location: transaction.location,
      ipAddress: transaction.ipAddress
    });

    return successResponse(res, 200, "Transaction trace generated", { trace });
  } catch (error) {
    next(error);
  }
};

const streamTransactionTrace = async (req, res, next) => {
  try {
    const transaction = await getTransactionById({
      user: req.user,
      id: req.params.id
    });

    const trace = buildTrace({
      transactionId: transaction.id,
      location: transaction.location,
      ipAddress: transaction.ipAddress
    });

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    let idx = 0;
    const tickMs = Math.max(Number(req.query.intervalMs) || 1200, 250);

    const send = (event, data) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    send("trace_init", { nodes: trace.nodes, originCity: trace.originCity, destinationCity: trace.destinationCity });

    const interval = setInterval(() => {
      if (idx >= trace.points.length) {
        send("trace_end", { done: true });
        clearInterval(interval);
        res.end();
        return;
      }

      send("trace_point", trace.points[idx]);
      idx++;
    }, tickMs);

    req.on("close", () => {
      clearInterval(interval);
    });
  } catch (error) {
    next(error);
  }
};

const streamTransactions = async (req, res, next) => {
  try {
    // For demo/live dashboards: stream recent transactions the user is allowed to see.
    // This does not require new transactions to be created; it loops over the latest set.
    const isAdmin = req.user.role === "ADMIN" || req.user.role === "ANALYST";

    const where = isAdmin ? {} : { userId: req.user.id };

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders?.();

    const send = (event, data) => {
      res.write(`event: ${event}\n`);
      res.write(`data: ${JSON.stringify(data)}\n\n`);
    };

    send("hello", { ok: true });

    let idx = 0;
    const tickMs = Math.max(Number(req.query.intervalMs) || 1800, 400);

    const interval = setInterval(async () => {
      try {
        const txs = await require("../config/db").transaction.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: 25
        });

        if (!txs.length) return;

        const tx = txs[idx % txs.length];
        idx++;

        const trace = buildTrace({
          transactionId: tx.id,
          location: tx.location,
          ipAddress: tx.ipAddress
        });

        send("txn_trace", {
          transactionId: tx.id,
          transactionRef: tx.transactionRef,
          amount: tx.amount.toString(),
          currency: tx.currency,
          riskScore: tx.riskScore,
          riskLevel: tx.riskLevel,
          originCity: trace.originCity,
          destinationCity: trace.destinationCity,
          points: trace.points
        });
      } catch (e) {
        // keep SSE alive even if a query fails temporarily
      }
    }, tickMs);

    req.on("close", () => clearInterval(interval));
  } catch (error) {
    next(error);
  }
};

module.exports = {
  analyzeTransaction,
  getTransactions,
  getTransaction,
  getTransactionTrace,
  streamTransactionTrace,
  streamTransactions
};
