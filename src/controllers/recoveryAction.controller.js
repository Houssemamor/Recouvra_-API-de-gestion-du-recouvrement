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

function formatJoiError(error) {
  return error.details.map((detail) => detail.message);
}

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
