const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const compression = require("compression");
const rateLimit = require("express-rate-limit");
const swaggerUi = require("swagger-ui-express");
const openapi = require("./docs/openapi");

const healthRoutes = require("./routes/health.routes");
const authRoutes = require("./routes/auth.routes");
const transactionRoutes = require("./routes/transaction.routes");
const ipRoutes = require("./routes/ip.routes");
const alertRoutes = require("./routes/alert.routes");
const adminRoutes = require("./routes/admin.routes");
const reportRoutes = require("./routes/report.routes");
const indexRoutes = require("./routes/index.routes");
const auditRoutes = require("./routes/audit.routes");

const { notFoundHandler, errorHandler } = require("./middleware/error.middleware");

const app = express();

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

app.use(
  rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    limit: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      message: "Too many requests. Please try again later."
    }
  })
);

if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

app.use("/api/health", healthRoutes);
app.use("/api", indexRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openapi));
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/ip", ipRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/audit-logs", auditRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
