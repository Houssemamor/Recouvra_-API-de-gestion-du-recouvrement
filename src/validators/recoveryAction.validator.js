// Module 6 - Recovery Action Validators
// Joi schemas for validating input on recovery action endpoints.
// Reuses ACTION_TYPES and ACTION_RESULTS from the model to stay in sync.

const Joi = require("joi");
const { ACTION_TYPES, ACTION_RESULTS } = require("../models/recoveryAction.model");

// Reusable schema for validating MongoDB ObjectId strings (24-char hex).
const mongoIdSchema = Joi.string().hex().length(24).required();

// Schema for POST /api/recovery-actions — all required fields for creation.
const createRecoveryActionSchema = Joi.object({
  invoice: mongoIdSchema,
  actionType: Joi.string()
    .valid(...ACTION_TYPES)
    .required(),
  actionDate: Joi.date().iso().optional(),
  result: Joi.string()
    .valid(...ACTION_RESULTS)
    .optional(),
  nextActionDate: Joi.date().iso().allow(null).optional(),
  comment: Joi.string().trim().allow("").max(1000).optional(),
});

// Schema for PUT /api/recovery-actions/:id — partial update, at least one field required.
const updateRecoveryActionSchema = Joi.object({
  actionType: Joi.string()
    .valid(...ACTION_TYPES)
    .optional(),
  actionDate: Joi.date().iso().optional(),
  result: Joi.string()
    .valid(...ACTION_RESULTS)
    .optional(),
  nextActionDate: Joi.date().iso().allow(null).optional(),
  comment: Joi.string().trim().allow("").max(1000).optional(),
}).min(1);

// Schema for GET /api/recovery-actions query string filters.
const listRecoveryActionQuerySchema = Joi.object({
  invoice: mongoIdSchema.optional(),
  client: mongoIdSchema.optional(),
  agent: mongoIdSchema.optional(),
  actionType: Joi.string()
    .valid(...ACTION_TYPES)
    .optional(),
  result: Joi.string()
    .valid(...ACTION_RESULTS)
    .optional(),
  from: Joi.date().iso().optional(),
  to: Joi.date().iso().optional(),
});

function validateRecoveryActionCreation(payload) {
  return createRecoveryActionSchema.validate(payload, { abortEarly: false });
}

function validateRecoveryActionUpdate(payload) {
  return updateRecoveryActionSchema.validate(payload, { abortEarly: false });
}

function validateRecoveryActionId(actionId) {
  return mongoIdSchema.validate(actionId);
}

function validateRecoveryActionQuery(payload) {
  return listRecoveryActionQuerySchema.validate(payload, { abortEarly: false });
}

module.exports = {
  validateRecoveryActionCreation,
  validateRecoveryActionUpdate,
  validateRecoveryActionId,
  validateRecoveryActionQuery,
};
