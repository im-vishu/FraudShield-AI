const express = require("express");
const {
  analyzeTransaction,
  getTransactions,
  getTransaction,
  getTransactionTrace,
  streamTransactionTrace,
  streamTransactions
} = require("../controllers/transaction.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post("/analyze", analyzeTransaction);
router.get("/", getTransactions);
router.get("/stream", streamTransactions);
router.get("/:id", getTransaction);
router.get("/:id/trace", getTransactionTrace);
router.get("/:id/trace/stream", streamTransactionTrace);

module.exports = router;
