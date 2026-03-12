// Module 7 - Statistics Routes
// Mounts read-only stats endpoints under /api/stats.
// All routes require authentication + manager or admin role.

const { Router } = require("express");
const { auth, authorize } = require("../middlewares/auth.middleware");
const { overview, invoices, agents } = require("../controllers/stats.controller");

const statsRouter = Router();

// Dashboard overview: counts + financial summary.
statsRouter.get("/overview", auth, authorize(["manager", "admin"]), overview);
// Invoice stats: grouped by status + overdue count.
statsRouter.get("/invoices", auth, authorize(["manager", "admin"]), invoices);
// Agent stats: recovery actions per agent.
statsRouter.get("/agents", auth, authorize(["manager", "admin"]), agents);

module.exports = statsRouter;
