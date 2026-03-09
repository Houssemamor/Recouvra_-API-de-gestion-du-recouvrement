const { Router } = require("express");
const { auth, authorize } = require("../middlewares/auth.middleware");
const {
  create,
  list,
  getById,
  updateById,
  removeById,
} = require("../controllers/invoice.controller");

const invoiceRouter = Router();

invoiceRouter.post("/", auth, authorize(["manager", "admin"]), create);
invoiceRouter.get("/", auth, list);
invoiceRouter.get("/:id", auth, getById);
invoiceRouter.put("/:id", auth, authorize(["manager", "admin"]), updateById);
invoiceRouter.delete("/:id", auth, authorize(["manager", "admin"]), removeById);

module.exports = invoiceRouter;
