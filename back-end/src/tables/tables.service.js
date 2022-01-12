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

//Uses knex transactions to ensure table and reservation update in sync
async function update(newReservation, newTable) {
    return knex.transaction(function (trans) {
        return knex("reservations")
            .transacting(trans)
            .where({ reservation_id: newReservation.reservation_id })
            .update(newReservation)
            .then(function () {
                return knex("tables")
                    .where({ table_id: newTable.table_id })
                    .update(newTable)
                    .then((data) => data[0])
            })
            .then(trans.commit)
            .catch(function (error) {
                trans.rollback();
                throw new Error("Transaction error on update: " + error);
            })
    });
}

async function list() {
    return knex("tables")
        .select("*")
        .orderBy("table_name", "asc");
}

module.exports = {
    create,
    read,
    update,
    list,
    readReservation,
}
