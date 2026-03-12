// Module 7 - Statistics Service
// Aggregation queries that power the /api/stats endpoints.
// Provides: overview counts + financials, invoice breakdown by status, and per-agent action counts.

const { Client } = require("../models/client.model");
const { Invoice } = require("../models/invoice.model");
const { Payment } = require("../models/payment.model");
const { RecoveryAction } = require("../models/recoveryAction.model");
const { User } = require("../models/user.model");

// GET /api/stats/overview
// Returns total counts (clients, invoices, payments, recovery actions)
// and financial summary (totalInvoiced, totalCollected, totalOutstanding).
async function getOverviewStats() {
  const [totalClients, totalInvoices, totalPayments, totalRecoveryActions] = await Promise.all([
    Client.countDocuments(),
    Invoice.countDocuments(),
    Payment.countDocuments(),
    RecoveryAction.countDocuments(),
  ]);

  const [financial] = await Invoice.aggregate([
    {
      $group: {
        _id: null,
        totalInvoiced: { $sum: "$amountTotal" },
        totalCollected: { $sum: "$amountPaid" },
      },
    },
    {
      $project: {
        _id: 0,
        totalInvoiced: 1,
        totalCollected: 1,
        totalOutstanding: { $subtract: ["$totalInvoiced", "$totalCollected"] },
      },
    },
  ]);

  return {
    totalClients,
    totalInvoices,
    totalPayments,
    totalRecoveryActions,
    financial: financial || {
      totalInvoiced: 0,
      totalCollected: 0,
      totalOutstanding: 0,
    },
  };
}

// GET /api/stats/invoices
// Returns invoice counts grouped by status and the number of overdue invoices
// (dueDate in the past and status is not "paid").
async function getInvoiceStats() {
  const now = new Date();

  const [byStatus, overdue] = await Promise.all([
    Invoice.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          amountTotal: { $sum: "$amountTotal" },
          amountPaid: { $sum: "$amountPaid" },
        },
      },
      { $sort: { _id: 1 } },
    ]),
    Invoice.countDocuments({ dueDate: { $lt: now }, status: { $ne: "paid" } }),
  ]);

  return {
    byStatus,
    overdue,
  };
}

// GET /api/stats/agents
// Aggregates recovery actions per agent using a $lookup to resolve agent details.
// Returns totalAgents, count of agents with at least one action, and per-agent breakdown.
async function getAgentStats() {
  const stats = await RecoveryAction.aggregate([
    {
      $group: {
        _id: "$agent",
        totalActions: { $sum: 1 },
        lastActionDate: { $max: "$actionDate" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "agent",
      },
    },
    {
      $unwind: {
        path: "$agent",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        agentId: "$_id",
        fullName: "$agent.fullName",
        email: "$agent.email",
        role: "$agent.role",
        totalActions: 1,
        lastActionDate: 1,
      },
    },
    { $sort: { totalActions: -1 } },
  ]);

  const totalAgents = await User.countDocuments({ role: "agent", isActive: true });

  return {
    totalAgents,
    activeAgentsWithActions: stats.length,
    byAgent: stats,
  };
}

module.exports = {
  getOverviewStats,
  getInvoiceStats,
  getAgentStats,
};
