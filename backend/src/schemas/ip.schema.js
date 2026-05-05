const Joi = require("joi");

const ipCheckSchema = Joi.object({
  ipAddress: Joi.string().ip({ version: ["ipv4", "ipv6"] }).required()
});

module.exports = {
  ipCheckSchema
};