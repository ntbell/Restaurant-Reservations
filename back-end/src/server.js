const PORT = process.env.PORT || 5000;
console.log("Port is: " + PORT);

const app = require("./app");
const knex = require("./db/connection");
console.log("Pulled app and knex");

knex.migrate
  .latest()
  .then(app.listen(PORT, listener))
  .catch((error) => {
    console.error(error);
    console.log("error found, entered catch")
    knex.destroy();
  });

console.log("Called knex.migrate");

function listener() {
  console.log(`Listening on Port ${PORT}!`);
}
