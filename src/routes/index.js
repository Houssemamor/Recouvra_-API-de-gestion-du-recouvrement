const { Router } = require("express");
const { getHealth } = require("../controllers/health.controller");
const authRouter = require("./auth.routes");
const clientRouter = require("./client.routes");
const invoiceRouter = require("./invoice.routes");

const router = Router();

router.get("/health", getHealth);
router.use("/auth", authRouter);
router.use("/clients", clientRouter);
router.use("/invoices", invoiceRouter);

module.exports = router;
