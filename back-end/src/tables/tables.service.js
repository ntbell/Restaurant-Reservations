const knex = require("../db/connection");

async function create(newTable) {
    return knex("tables")
        .insert(newTable, "*")
        .then(data => data[0]);
}

async function read(table_id) {
    return knex("tables")
        .where({ table_id })
        .select("*")
        .first();
}

async function readReservation(reservation_id) {
    return knex("reservations")
        .where({ reservation_id })
        .select("*")
        .first();
}

async function update(newTable) {
    return knex("tables")
        .select("*")
        .where({ table_id: newTable.table_id })
        .update(newTable)
        .then((data) => data[0]);
}

async function destroy() {

}

async function list() {
    return knex("tables").select("*").orderBy("table_name", "asc");
}

module.exports = {
    create,
    read,
    update,
    delete: destroy,
    list,
    readReservation,
}
