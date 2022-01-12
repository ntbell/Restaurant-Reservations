const environment = process.env.NODE_ENV || "development";
console.log("Environment is: " + environment);
const config = require("../../knexfile")[environment];
const knex = require("knex")(config);

module.exports = knex;
