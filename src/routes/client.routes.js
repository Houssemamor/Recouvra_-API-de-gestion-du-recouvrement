const { Router } = require("express");
const { auth, authorize } = require("../middlewares/auth.middleware");
const {
  create,
  list,
  getById,
  updateById,
  removeById,
} = require("../controllers/client.controller");

const clientRouter = Router();

clientRouter.post("/", auth, authorize(["manager", "admin"]), create);
clientRouter.get("/", auth, list);
clientRouter.get("/:id", auth, getById);
clientRouter.put("/:id", auth, authorize(["manager", "admin"]), updateById);
clientRouter.delete("/:id", auth, authorize(["manager", "admin"]), removeById);

module.exports = clientRouter;
