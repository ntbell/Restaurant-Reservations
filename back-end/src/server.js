const PORT = process.env.PORT || 5000;
console.log("Port is: " + PORT);

const app = require("./app");
const knex = require("./db/connection");
console.log("Pulled app and knex");

app.listen(PORT, listener)

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}
