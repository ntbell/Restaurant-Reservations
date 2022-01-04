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

async function update(newReservation, newTable) {
    return knex.transaction(function (t) {
        return knex("reservations")
            .transacting(t)
            .where({ reservation_id: newReservation.reservation_id })
            .update(newReservation)
            .then(function () {
                return knex("tables")
                    .where({ table_id: newTable.table_id })
                    .update(newTable)
                    .then((data) => data[0])
            })
            .then(t.commit)
            .catch(function (e) {
                t.rollback();
                throw new Error("Transaction error on update: " + e);
            })
    });
}

async function destroy(table_id) {
    /*
    //Delete in controller just uses service.update
    return knex("tables")
        .select("reservation_id")
        .where({ table_id })
        .del()
        */
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
