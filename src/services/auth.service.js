const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const env = require("../config/env");

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
};

function sanitizeUser(userDocument) {
  return {
    id: userDocument._id.toString(),
    fullName: userDocument.fullName,
    email: userDocument.email,
    role: userDocument.role,
    isActive: userDocument.isActive,
    createdAt: userDocument.createdAt,
    updatedAt: userDocument.updatedAt,
  };
}

function signAccessToken(userDocument) {
  return jwt.sign(
    {
      sub: userDocument._id.toString(),
      role: userDocument.role,
      email: userDocument.email,
    },
    env.jwtSecret,
    { expiresIn: "1d" }
  );
}

async function registerUser(payload) {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    const error = new Error("Email already in use");
    error.statusCode = 409;
    throw error;
  }
  const passwordHash = await argon2.hash(payload.password, ARGON2_OPTIONS);

  const user = await User.create({
    fullName: payload.fullName,
    email: payload.email.toLowerCase(),
    passwordHash,
    role: payload.role || "agent",
  });

  return {
    token: signAccessToken(user),
    user: sanitizeUser(user),
  };
}

async function loginUser(payload) {
  const user = await User.findOne({ email: payload.email.toLowerCase() });
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isPasswordValid = await argon2.verify(user.passwordHash, payload.password);
  if (!isPasswordValid) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  if (!user.isActive) {
    const error = new Error("User is inactive");
    error.statusCode = 403;
    throw error;
  }

  return {
    token: signAccessToken(user),
    user: sanitizeUser(user),
  };
}

async function findUserById(userId) {
  const user = await User.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeUser(user);
}

module.exports = {
  registerUser,
  loginUser,
  findUserById,
};
