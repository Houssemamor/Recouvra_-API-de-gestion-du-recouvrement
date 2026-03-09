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

recoveryActionRouter.post("/", auth, authorize(["agent", "manager", "admin"]), create);
recoveryActionRouter.get("/", auth, authorize(["agent", "manager", "admin"]), list);
recoveryActionRouter.get("/:id", auth, authorize(["agent", "manager", "admin"]), getById);
recoveryActionRouter.put("/:id", auth, authorize(["manager", "admin"]), updateById);
recoveryActionRouter.delete("/:id", auth, authorize(["manager", "admin"]), removeById);

module.exports = recoveryActionRouter;
