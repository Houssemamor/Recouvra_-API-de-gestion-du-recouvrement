const Joi = require("joi");
const { INVOICE_STATUSES } = require("../models/invoice.model");

const mongoIdSchema = Joi.string().hex().length(24).required();

const createInvoiceSchema = Joi.object({
  client: mongoIdSchema,
  invoiceNumber: Joi.string().trim().allow("").max(80).optional(),
  amountTotal: Joi.number().min(0).required(),
  amountPaid: Joi.number().min(0).optional(),
  dueDate: Joi.date().iso().required(),
  status: Joi.string()
    .valid(...INVOICE_STATUSES)
    .optional(),
  notes: Joi.string().trim().allow("").max(500).optional(),
  metadata: Joi.object().unknown(true).optional(),
});

const updateInvoiceSchema = Joi.object({
  client: mongoIdSchema.optional(),
  invoiceNumber: Joi.string().trim().allow("").max(80).optional(),
  amountTotal: Joi.number().min(0).optional(),
  amountPaid: Joi.number().min(0).optional(),
  dueDate: Joi.date().iso().optional(),
  status: Joi.string()
    .valid(...INVOICE_STATUSES)
    .optional(),
  notes: Joi.string().trim().allow("").max(500).optional(),
  metadata: Joi.object().unknown(true).optional(),
}).min(1);

const listInvoiceQuerySchema = Joi.object({
  status: Joi.string()
    .valid(...INVOICE_STATUSES)
    .optional(),
  client: mongoIdSchema.optional(),
  dueDateFrom: Joi.date().iso().optional(),
  dueDateTo: Joi.date().iso().optional(),
  search: Joi.string().trim().allow("").optional(),
});

function validateInvoiceCreation(payload) {
  return createInvoiceSchema.validate(payload, { abortEarly: false });
}

function validateInvoiceUpdate(payload) {
  return updateInvoiceSchema.validate(payload, { abortEarly: false });
}

function validateInvoiceId(invoiceId) {
  return mongoIdSchema.validate(invoiceId);
}

function validateInvoiceQuery(payload) {
  return listInvoiceQuerySchema.validate(payload, { abortEarly: false });
}

module.exports = {
  validateInvoiceCreation,
  validateInvoiceUpdate,
  validateInvoiceId,
  validateInvoiceQuery,
};
