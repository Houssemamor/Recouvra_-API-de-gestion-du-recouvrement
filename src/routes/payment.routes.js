const { Router } = require("express");
const { auth, authorize } = require("../middlewares/auth.middleware");
const { create } = require("../controllers/payment.controller");

const paymentRouter = Router();

paymentRouter.post("/", auth, authorize(["manager", "admin"]), create);

module.exports = paymentRouter;
