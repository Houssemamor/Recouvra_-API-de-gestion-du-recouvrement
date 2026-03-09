const express = require("express");
const routes = require("./routes");
const { notFoundHandler, errorHandler } = require("./middlewares/error.middleware");
const { mountSwagger } = require("./docs/swagger");

const app = express();

app.use(express.json());
mountSwagger(app);
app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
