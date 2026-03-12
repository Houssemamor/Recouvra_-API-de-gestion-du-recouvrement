// Module 6 - Recovery Action Routes
// Mounts CRUD endpoints under /api/recovery-actions.
// Access control:
//   - POST, GET (list/detail): agent, manager, admin
//   - PUT, DELETE: manager, admin only

const { Router } = require("express");
const { auth, authorize } = require("../middlewares/auth.middleware");
const {
  create,
  list,
  getById,
  updateById,
  removeById,
} = require("../controllers/recoveryAction.controller");

const recoveryActionRouter = Router();

// Create a recovery action — any authenticated role.
recoveryActionRouter.post("/", auth, authorize(["agent", "manager", "admin"]), create);
// List recovery actions with optional filters.
recoveryActionRouter.get("/", auth, authorize(["agent", "manager", "admin"]), list);
// Get a single recovery action by ID.
recoveryActionRouter.get("/:id", auth, authorize(["agent", "manager", "admin"]), getById);
// Update a recovery action — manager/admin only.
recoveryActionRouter.put("/:id", auth, authorize(["manager", "admin"]), updateById);
// Delete a recovery action — manager/admin only.
recoveryActionRouter.delete("/:id", auth, authorize(["manager", "admin"]), removeById);

module.exports = recoveryActionRouter;
