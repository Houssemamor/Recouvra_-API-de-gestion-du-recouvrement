const Joi = require("joi");
const { ACTION_TYPES, ACTION_RESULTS } = require("../models/recoveryAction.model");

const mongoIdSchema = Joi.string().hex().length(24).required();

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
