const Joi = require("joi");
const { PAYMENT_METHODS } = require("../models/payment.model");

const createPaymentSchema = Joi.object({
  invoice: Joi.string().hex().length(24).required(),
  amount: Joi.number().min(0.01).required(),
  paymentDate: Joi.date().iso().optional(),
  method: Joi.string()
    .valid(...PAYMENT_METHODS)
    .optional(),
  note: Joi.string().trim().allow("").max(500).optional(),
});

function validatePaymentCreation(payload) {
  return createPaymentSchema.validate(payload, { abortEarly: false });
}

module.exports = {
  validatePaymentCreation,
};
