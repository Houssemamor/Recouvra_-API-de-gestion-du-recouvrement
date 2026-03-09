// Module 7 - Statistics Controller
// Thin HTTP handlers that delegate to stats.service and return JSON.
// All three endpoints require manager or admin role.

const {
  getOverviewStats,
  getInvoiceStats,
  getAgentStats,
} = require("../services/stats.service");

// GET /api/stats/overview — high-level dashboard numbers.
async function overview(req, res, next) {
  try {
    const stats = await getOverviewStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    return next(err);
  }
}

// GET /api/stats/invoices — invoice breakdown by status + overdue count.
async function invoices(req, res, next) {
  try {
    const stats = await getInvoiceStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    return next(err);
  }
}

// GET /api/stats/agents — per-agent recovery action counts.
async function agents(req, res, next) {
  try {
    const stats = await getAgentStats();
    return res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  overview,
  invoices,
  agents,
};
