const path = require("path");

require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

const express = require("express");
const cors = require("cors");

const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");
const reservationsRouter = require("./reservations/reservations.router");
const tablesRouter = require("./tables/tables.router");

const app = express();
console.log("initialized app");

app.use(cors());
app.use(express.json());
console.log("Using cors and express");

console.log("Trying .use on /reservations and /tables...");
app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);
console.log("Success!");
app.use(notFound);
app.use(errorHandler);
console.log("Finished in app.js");

module.exports = app;
