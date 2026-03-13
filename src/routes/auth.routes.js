const { Router } = require("express");
const { register, login, me } = require("../controllers/auth.controller");
const { auth, authorize } = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validate.middleware");
const { registerSchema, loginSchema } = require("../validators/auth.validator");

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
authRouter.get("/me", auth, me);
authRouter.get("/manager-area", auth, authorize(["manager", "admin"]), (_req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authorized access for manager/admin",
  });
});

module.exports = authRouter;
