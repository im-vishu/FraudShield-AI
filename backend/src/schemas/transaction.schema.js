const Joi = require("joi");

const analyzeTransactionSchema = Joi.object({
  transactionRef: Joi.string().trim().min(4).max(120).required(),
  amount: Joi.number().positive().precision(2).required(),
  currency: Joi.string().trim().uppercase().length(3).default("INR"),

  senderAccount: Joi.string().trim().max(120).allow(null, ""),
  receiverAccount: Joi.string().trim().max(120).allow(null, ""),

  ipAddress: Joi.string().ip({ version: ["ipv4", "ipv6"] }).allow(null, ""),
  deviceId: Joi.string().trim().max(120).allow(null, ""),
  location: Joi.string().trim().max(120).allow(null, ""),

  transactionTime: Joi.date().iso().optional()
});

module.exports = {
  analyzeTransactionSchema
};