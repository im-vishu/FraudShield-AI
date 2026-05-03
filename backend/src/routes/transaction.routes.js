const express = require("express");
const {
  analyzeTransaction,
  getTransactions
} = require("../controllers/transaction.controller");
const { authenticate } = require("../middleware/auth.middleware");

const router = express.Router();

router.use(authenticate);

router.post("/analyze", analyzeTransaction);
router.get("/", getTransactions);

module.exports = router;