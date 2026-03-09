const { RecoveryAction } = require("../models/recoveryAction.model");
const { Invoice } = require("../models/invoice.model");

function sanitizeRecoveryAction(actionDocument) {
  const invoiceData = actionDocument.invoice && typeof actionDocument.invoice === "object"
    ? {
        id: actionDocument.invoice._id ? actionDocument.invoice._id.toString() : actionDocument.invoice.id,
        invoiceNumber: actionDocument.invoice.invoiceNumber,
        client: actionDocument.invoice.client && typeof actionDocument.invoice.client === "object"
          ? {
              id: actionDocument.invoice.client._id
                ? actionDocument.invoice.client._id.toString()
                : actionDocument.invoice.client.id,
              companyName: actionDocument.invoice.client.companyName,
            }
          : actionDocument.invoice.client
            ? actionDocument.invoice.client.toString()
            : null,
      }
    : actionDocument.invoice
      ? actionDocument.invoice.toString()
      : null;

  const agentData = actionDocument.agent && typeof actionDocument.agent === "object"
    ? {
        id: actionDocument.agent._id ? actionDocument.agent._id.toString() : actionDocument.agent.id,
        fullName: actionDocument.agent.fullName,
        email: actionDocument.agent.email,
      }
    : actionDocument.agent
      ? actionDocument.agent.toString()
      : null;

  return {
    id: actionDocument._id.toString(),
    invoice: invoiceData,
    actionType: actionDocument.actionType,
    actionDate: actionDocument.actionDate,
    result: actionDocument.result,
    nextActionDate: actionDocument.nextActionDate,
    comment: actionDocument.comment,
    agent: agentData,
    createdAt: actionDocument.createdAt,
    updatedAt: actionDocument.updatedAt,
  };
}

async function assertInvoiceExists(invoiceId) {
  const invoice = await Invoice.findById(invoiceId);
  if (!invoice) {
    const error = new Error("Invoice not found");
    error.statusCode = 404;
    throw error;
  }

  return invoice;
}

async function createRecoveryAction(payload, actor) {
  await assertInvoiceExists(payload.invoice);

  const action = await RecoveryAction.create({
    invoice: payload.invoice,
    actionType: payload.actionType,
    actionDate: payload.actionDate || new Date(),
    result: payload.result || "pending",
    nextActionDate: payload.nextActionDate || null,
    comment: payload.comment || "",
    agent: actor.sub,
  });

  const populated = await action.populate([
    { path: "invoice", select: "invoiceNumber client", populate: { path: "client", select: "companyName" } },
    { path: "agent", select: "fullName email" },
  ]);

  return sanitizeRecoveryAction(populated);
}

async function listRecoveryActions(filters = {}) {
  const query = {};

  if (filters.invoice) {
    query.invoice = filters.invoice;
  }

  if (filters.agent) {
    query.agent = filters.agent;
  }

  if (filters.actionType) {
    query.actionType = filters.actionType;
  }

  if (filters.result) {
    query.result = filters.result;
  }

  if (filters.from || filters.to) {
    query.actionDate = {};
    if (filters.from) {
      query.actionDate.$gte = new Date(filters.from);
    }
    if (filters.to) {
      query.actionDate.$lte = new Date(filters.to);
    }
  }

  if (filters.client) {
    const invoices = await Invoice.find({ client: filters.client }).select("_id");
    query.invoice = { $in: invoices.map((inv) => inv._id) };
  }

  const actions = await RecoveryAction.find(query)
    .populate({ path: "invoice", select: "invoiceNumber client", populate: { path: "client", select: "companyName" } })
    .populate("agent", "fullName email")
    .sort({ actionDate: -1, createdAt: -1 });

  return actions.map(sanitizeRecoveryAction);
}

async function getRecoveryActionById(actionId) {
  const action = await RecoveryAction.findById(actionId)
    .populate({ path: "invoice", select: "invoiceNumber client", populate: { path: "client", select: "companyName" } })
    .populate("agent", "fullName email");

  if (!action) {
    const error = new Error("Recovery action not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeRecoveryAction(action);
}

async function updateRecoveryActionById(actionId, payload) {
  const action = await RecoveryAction.findByIdAndUpdate(actionId, payload, {
    new: true,
    runValidators: true,
  })
    .populate({ path: "invoice", select: "invoiceNumber client", populate: { path: "client", select: "companyName" } })
    .populate("agent", "fullName email");

  if (!action) {
    const error = new Error("Recovery action not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeRecoveryAction(action);
}

async function deleteRecoveryActionById(actionId) {
  const deleted = await RecoveryAction.findByIdAndDelete(actionId);
  if (!deleted) {
    const error = new Error("Recovery action not found");
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  createRecoveryAction,
  listRecoveryActions,
  getRecoveryActionById,
  updateRecoveryActionById,
  deleteRecoveryActionById,
};
