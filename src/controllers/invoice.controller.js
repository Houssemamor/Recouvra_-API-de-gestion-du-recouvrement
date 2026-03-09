const {
  validateInvoiceCreation,
  validateInvoiceUpdate,
  validateInvoiceId,
  validateInvoiceQuery,
} = require("../validators/invoice.validator");
const {
  createInvoice,
  listInvoices,
  getInvoiceById,
  updateInvoiceById,
  deleteInvoiceById,
} = require("../services/invoice.service");

function formatJoiError(error) {
  return error.details.map((detail) => detail.message);
}

async function create(req, res, next) {
  try {
    const { error, value } = validateInvoiceCreation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const invoice = await createInvoice(value);
    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const { error, value } = validateInvoiceQuery(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const invoices = await listInvoices(value);

    return res.status(200).json({
      success: true,
      data: invoices,
    });
  } catch (err) {
    return next(err);
  }
}

async function getById(req, res, next) {
  try {
    const idValidation = validateInvoiceId(req.params.id);
    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice id",
      });
    }

    const invoice = await getInvoiceById(req.params.id);
    return res.status(200).json({
      success: true,
      data: invoice,
    });
  } catch (err) {
    return next(err);
  }
}

async function updateById(req, res, next) {
  try {
    const idValidation = validateInvoiceId(req.params.id);
    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice id",
      });
    }

    const { error, value } = validateInvoiceUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const invoice = await updateInvoiceById(req.params.id, value);
    return res.status(200).json({
      success: true,
      message: "Invoice updated successfully",
      data: invoice,
    });
  } catch (err) {
    return next(err);
  }
}

async function removeById(req, res, next) {
  try {
    const idValidation = validateInvoiceId(req.params.id);
    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid invoice id",
      });
    }

    await deleteInvoiceById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Invoice deleted successfully",
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
