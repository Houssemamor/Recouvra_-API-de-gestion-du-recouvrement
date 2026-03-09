const Joi = require("joi");
const { USER_ROLES } = require("../models/user.model");

const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(120).required(),
  email: Joi.string().trim().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string()
    .valid(...USER_ROLES)
    .optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().trim().email().required(),
  password: Joi.string().required(),
});

function validateRegister(payload) {
  return registerSchema.validate(payload, { abortEarly: false });
}

function validateLogin(payload) {
  return loginSchema.validate(payload, { abortEarly: false });
}

module.exports = {
  validateRegister,
  validateLogin,
};
