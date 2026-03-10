const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../models/user.model");
const env = require("../config/env");

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
 
  // will be changed to argon2id issue #1
  const passwordHash = await bcrypt.hash(payload.password, 10);

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

  const isPasswordValid = await bcrypt.compare(payload.password, user.passwordHash);
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
