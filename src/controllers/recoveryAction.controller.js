// Module 6 - Recovery Actions Controller
// HTTP handlers for recovery action CRUD. Each handler:
//   1. Validates input via Joi schemas
//   2. Delegates to the service layer
//   3. Returns a consistent JSON response { success, message?, data? }
// Errors are forwarded to the centralized error middleware via next().

const {
  validateRecoveryActionCreation,
  validateRecoveryActionUpdate,
  validateRecoveryActionId,
  validateRecoveryActionQuery,
} = require("../validators/recoveryAction.validator");
const {
  createRecoveryAction,
  listRecoveryActions,
  getRecoveryActionById,
  updateRecoveryActionById,
  deleteRecoveryActionById,
} = require("../services/recoveryAction.service");

// Extracts human-readable messages from Joi validation errors.
function formatJoiError(error) {
  return error.details.map((detail) => detail.message);
}

// POST /api/recovery-actions — Create a new recovery action.
// Body: { invoice, actionType, actionDate?, result?, nextActionDate?, comment? }
// The agent is inferred from the authenticated user (req.user).
async function create(req, res, next) {
  try {
    const { error, value } = validateRecoveryActionCreation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const action = await createRecoveryAction(value, req.user);
    return res.status(201).json({
      success: true,
      message: "Recovery action created successfully",
      data: action,
    });
  } catch (err) {
    return next(err);
  }
}

// GET /api/recovery-actions — List recovery actions with optional query filters.
// Query params: invoice, client, agent, actionType, result, from, to.
async function list(req, res, next) {
  try {
    const { error, value } = validateRecoveryActionQuery(req.query);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const actions = await listRecoveryActions(value);
    return res.status(200).json({
      success: true,
      data: actions,
    });
  } catch (err) {
    return next(err);
  }
}

// GET /api/recovery-actions/:id — Fetch a single recovery action by ID.
async function getById(req, res, next) {
  try {
    const idValidation = validateRecoveryActionId(req.params.id);
    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid recovery action id",
      });
    }

    const action = await getRecoveryActionById(req.params.id);
    return res.status(200).json({
      success: true,
      data: action,
    });
  } catch (err) {
    return next(err);
  }
}

// PUT /api/recovery-actions/:id — Update a recovery action (manager/admin only).
// Body: partial update with at least one field.
async function updateById(req, res, next) {
  try {
    const idValidation = validateRecoveryActionId(req.params.id);
    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid recovery action id",
      });
    }

    const { error, value } = validateRecoveryActionUpdate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const action = await updateRecoveryActionById(req.params.id, value);
    return res.status(200).json({
      success: true,
      message: "Recovery action updated successfully",
      data: action,
    });
  } catch (err) {
    return next(err);
  }
}

// DELETE /api/recovery-actions/:id — Delete a recovery action (manager/admin only).
async function removeById(req, res, next) {
  try {
    const idValidation = validateRecoveryActionId(req.params.id);
    if (idValidation.error) {
      return res.status(400).json({
        success: false,
        message: "Invalid recovery action id",
      });
    }

    await deleteRecoveryActionById(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Recovery action deleted successfully",
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
