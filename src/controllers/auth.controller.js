const { validateRegister, validateLogin } = require("../validators/auth.validator");
const { registerUser, loginUser, findUserById } = require("../services/auth.service");

function formatJoiError(error) {
  return error.details.map((detail) => detail.message);
}

async function register(req, res, next) {
  try {
    const { error, value } = validateRegister(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const result = await registerUser(value);
    return res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { error, value } = validateLogin(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: formatJoiError(error),
      });
    }

    const result = await loginUser(value);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    return next(err);
  }
}

async function me(req, res, next) {
  try {
    const user = await findUserById(req.user.sub);
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  register,
  login,
  me,
};
