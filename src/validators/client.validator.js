const Joi = require("joi");
const { CLIENT_STATUSES } = require("../models/client.model");

const mongoIdSchema = Joi.string().hex().length(24).required();

const createClientSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(200).required(),
  contactName: Joi.string().trim().allow("").max(120).optional(),
  email: Joi.string().trim().email().allow("").optional(),
  phone: Joi.string().trim().allow("").max(40).optional(),
  address: Joi.string().trim().allow("").max(300).optional(),
  status: Joi.string()
    .valid(...CLIENT_STATUSES)
    .optional(),
  metadata: Joi.object().unknown(true).optional(),
});

const updateClientSchema = Joi.object({
  companyName: Joi.string().trim().min(2).max(200).optional(),
  contactName: Joi.string().trim().allow("").max(120).optional(),
  email: Joi.string().trim().email().allow("").optional(),
  phone: Joi.string().trim().allow("").max(40).optional(),
  address: Joi.string().trim().allow("").max(300).optional(),
  status: Joi.string()
    .valid(...CLIENT_STATUSES)
    .optional(),
  metadata: Joi.object().unknown(true).optional(),
}).min(1);

function validateClientCreation(payload) {
  return createClientSchema.validate(payload, { abortEarly: false });
}

function validateClientUpdate(payload) {
  return updateClientSchema.validate(payload, { abortEarly: false });
}

function validateClientId(clientId) {
  return mongoIdSchema.validate(clientId);
}

module.exports = {
  validateClientCreation,
  validateClientUpdate,
  validateClientId,
};
