const { validatePaymentCreation } = require("../validators/payment.validator");
const { createManualPayment } = require("../services/payment.service");

function formatJoiError(error) {
  return error.details.map((detail) => detail.message);
}

async function create(req, res, next) {
  try {
    const { error, value } = validatePaymentCreation(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const result = await createManualPayment(value);
    return res.status(201).json({
      success: true,
      message: "Payment recorded successfully",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
};
