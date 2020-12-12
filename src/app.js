require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const jsonParser = express.json();

const { NODE_ENV } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common;";
app.use(jsonParser);
app.use(morgan(morganOption));
app.use(cors());
app.use(helmet());

const productsRouter = require("./products/products-router");
const authRouter = require("./auth-folder/auth-router");

app.use("/api/products", productsRouter);
app.use("/api/auth", authRouter);

app.use(function errorHandler(error, req, res, next) {
  let response;
  if (NODE_ENV === "product") {
    response = { error: { message: "server error" } };
  } else {
    console.error(error);
    response = { message: error.message, error };
  }
  res.status(500).json(response);
});

module.exports = app;
