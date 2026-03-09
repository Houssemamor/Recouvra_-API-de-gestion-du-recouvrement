const {
  validateClientCreation,
  validateClientUpdate,
  validateClientId,
} = require("../validators/client.validator");
const {
  createClient,
  listClients,
  getClientById,
  updateClientById,
  deleteClientById,
} = require("../services/client.service");

function formatJoiError(error) {
  return error.details.map((detail) => detail.message);
}

async function create(req, res, next) {
  try {
    const { error, value } = validateClientCreation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const client = await createClient(value);
    return res.status(201).json({
      success: true,
      message: "Client created successfully",
      data: client,
    });
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const clients = await listClients({
      status: req.query.status,
      search: req.query.search,
    });

    return res.status(200).json({
      success: true,
      data: clients,
    });
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const idValidation = validateClientId(req.params.id);
    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid client id",
      });
    }

    const client = await getClientById(req.params.id);
    return res.status(200).json({
      success: true,
      data: client,
    });
  } catch (err) {
    return next(err);
  }
}

async function updateById(req, res, next) {
  try {
    const idValidation = validateClientId(req.params.id);
    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid client id",
      });
    }

    const { error, value } = validateClientUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const client = await updateClientById(req.params.id, value);
    return res.status(200).json({
      success: true,
      message: "Client updated successfully",
      data: client,
    });
  } catch (err) {
    return next(err);
  }
}

async function removeById(req, res, next) {
  try {
    const idValidation = validateClientId(req.params.id);
    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid client id",
      });
    }

    await deleteClientById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Client deleted successfully",
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  list,
  getById,
  updateById,
  removeById,
};
