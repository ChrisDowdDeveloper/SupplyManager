const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const itemsRouter = require("./items/items.router");
const ordersRouter = require("./order/order.router");

const app = express();

app.use(cors());
app.use(express.json());

app.use('/items', itemsRouter);
app.use("/orders", ordersRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;