const { Invoice } = require("../models/invoice.model");
const { Client } = require("../models/client.model");

function computeStatus(amountTotal, amountPaid, explicitStatus) {
  if (explicitStatus) {
    return explicitStatus;
  }

  if (amountPaid <= 0) {
    return "unpaid";
  }

  if (amountPaid >= amountTotal) {
    return "paid";
  }

  return "partial";
}

function sanitizeInvoice(invoiceDocument) {
  const clientData = invoiceDocument.client && typeof invoiceDocument.client === "object"
    ? {
        id: invoiceDocument.client._id ? invoiceDocument.client._id.toString() : invoiceDocument.client.id,
        companyName: invoiceDocument.client.companyName,
      }
    : invoiceDocument.client
      ? invoiceDocument.client.toString()
      : null;

  return {
    id: invoiceDocument._id.toString(),
    client: clientData,
    invoiceNumber: invoiceDocument.invoiceNumber,
    amountTotal: invoiceDocument.amountTotal,
    amountPaid: invoiceDocument.amountPaid,
    dueDate: invoiceDocument.dueDate,
    status: invoiceDocument.status,
    notes: invoiceDocument.notes,
    metadata: invoiceDocument.metadata,
    createdAt: invoiceDocument.createdAt,
    updatedAt: invoiceDocument.updatedAt,
  };
}

async function assertClientExists(clientId) {
  const client = await Client.findById(clientId);
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }
}

async function createInvoice(payload) {
  await assertClientExists(payload.client);

  const amountPaid = payload.amountPaid || 0;
  if (amountPaid > payload.amountTotal) {
    const error = new Error("amountPaid cannot be greater than amountTotal");
    error.statusCode = 400;
    throw error;
  }

  const invoice = await Invoice.create({
    ...payload,
    status: computeStatus(payload.amountTotal, amountPaid, payload.status),
    amountPaid,
  });

  const populated = await invoice.populate("client", "companyName");
  return sanitizeInvoice(populated);
}

async function listInvoices(filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.client) {
    query.client = filters.client;
  }

  if (filters.dueDateFrom || filters.dueDateTo) {
    query.dueDate = {};
    if (filters.dueDateFrom) {
      query.dueDate.$gte = new Date(filters.dueDateFrom);
    }
    if (filters.dueDateTo) {
      query.dueDate.$lte = new Date(filters.dueDateTo);
    }
  }

  if (filters.search) {
    query.invoiceNumber = { $regex: filters.search, $options: "i" };
  }

  const invoices = await Invoice.find(query)
    .populate("client", "companyName")
    .sort({ createdAt: -1 });

  return invoices.map(sanitizeInvoice);
}

async function getInvoiceById(invoiceId) {
  const invoice = await Invoice.findById(invoiceId).populate("client", "companyName");
  if (!invoice) {
    const error = new Error("Invoice not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeInvoice(invoice);
}

async function updateInvoiceById(invoiceId, payload) {
  const existing = await Invoice.findById(invoiceId);
  if (!existing) {
    const error = new Error("Invoice not found");
    error.statusCode = 404;
    throw error;
  }

  if (payload.client) {
    await assertClientExists(payload.client);
  }

  const amountTotal = payload.amountTotal !== undefined ? payload.amountTotal : existing.amountTotal;
  const amountPaid = payload.amountPaid !== undefined ? payload.amountPaid : existing.amountPaid;

  if (amountPaid > amountTotal) {
    const error = new Error("amountPaid cannot be greater than amountTotal");
    error.statusCode = 400;
    throw error;
  }

  const updatePayload = {
    ...payload,
    status: computeStatus(amountTotal, amountPaid, payload.status),
  };

  const invoice = await Invoice.findByIdAndUpdate(invoiceId, updatePayload, {
    new: true,
    runValidators: true,
  }).populate("client", "companyName");

  return sanitizeInvoice(invoice);
}

async function deleteInvoiceById(invoiceId) {
  const deleted = await Invoice.findByIdAndDelete(invoiceId);
  if (!deleted) {
    const error = new Error("Invoice not found");
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  createInvoice,
  listInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById,
};
