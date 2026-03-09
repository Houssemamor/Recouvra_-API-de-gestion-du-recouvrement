const { Client } = require("../models/client.model");

function sanitizeClient(clientDocument) {
  return {
    id: clientDocument._id.toString(),
    companyName: clientDocument.companyName,
    contactName: clientDocument.contactName,
    email: clientDocument.email,
    phone: clientDocument.phone,
    address: clientDocument.address,
    status: clientDocument.status,
    metadata: clientDocument.metadata,
    createdAt: clientDocument.createdAt,
    updatedAt: clientDocument.updatedAt,
  };
}

async function createClient(payload) {
  const client = await Client.create({
    ...payload,
    email: payload.email ? payload.email.toLowerCase() : "",
  });

  return sanitizeClient(client);
}

async function listClients(filters = {}) {
  const query = {};

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.search) {
    query.$or = [
      { companyName: { $regex: filters.search, $options: "i" } },
      { contactName: { $regex: filters.search, $options: "i" } },
      { email: { $regex: filters.search, $options: "i" } },
    ];
  }

  const clients = await Client.find(query).sort({ createdAt: -1 });
  return clients.map(sanitizeClient);
}

async function getClientById(clientId) {
  const client = await Client.findById(clientId);
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeClient(client);
}

async function updateClientById(clientId, payload) {
  const updatePayload = {
    ...payload,
  };

  if (payload.email !== undefined) {
    updatePayload.email = payload.email ? payload.email.toLowerCase() : "";
  }

  const client = await Client.findByIdAndUpdate(clientId, updatePayload, {
    new: true,
    runValidators: true,
  });

  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  return sanitizeClient(client);
}

async function deleteClientById(clientId) {
  const deleted = await Client.findByIdAndDelete(clientId);
  if (!deleted) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }
}

module.exports = {
  createClient,
  listClients,
  getClientById,
  updateClientById,
  deleteClientById,
};
