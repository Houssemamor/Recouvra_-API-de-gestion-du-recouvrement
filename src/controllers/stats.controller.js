const {
  getOverviewStats,
  getInvoiceStats,
  getAgentStats,
} = require("../services/stats.service");

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
