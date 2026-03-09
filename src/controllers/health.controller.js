const { getDatabaseStatus } = require("../config/database");

function getHealth(_req, res) {
  const db = getDatabaseStatus();

  res.status(200).json({
    success: true,
    message: "API is running",
    database: db,
    timestamp: new Date().toISOString(),
  });
}

module.exports = { getHealth };
