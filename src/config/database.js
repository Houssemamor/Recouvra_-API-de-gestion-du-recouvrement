const mongoose = require("mongoose");
const env = require("./env");

const DB_STATES = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting",
};

async function connectDatabase() {
  await mongoose.connect(env.mongoUri);
}

function getDatabaseStatus() {
  return {
    readyState: mongoose.connection.readyState,
    status: DB_STATES[mongoose.connection.readyState] || "unknown",
  };
}

module.exports = { connectDatabase, getDatabaseStatus };
