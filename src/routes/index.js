const { Router } = require("express");
const { getHealth } = require("../controllers/health.controller");
const authRouter = require("./auth.routes");
const clientRouter = require("./client.routes");

const router = Router();

router.get("/health", getHealth);
router.use("/auth", authRouter);
router.use("/clients", clientRouter);

module.exports = router;
