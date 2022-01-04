const knex = require("../db/connection");

async function create(newReservation) {
    return knex("reservations")
        .insert(newReservation, "*")
        .then(data => data[0]);
}

async function read(reservation_id) {
    return knex("reservations")
        .where({ reservation_id })
        .select("*")
        .first();
}

async function update(newReservation) {
    return knex("reservations")
        .select("*")
        .where({ reservation_id: newReservation.reservation_id })
        .update(newReservation, "status")
        .then((data) => data[0]);
}

async function destroy(reservation_id) {
    return knex("reservations").where({ reservation_id }).del();
}

async function list(reservation_date) {
    return knex("reservations")
        .whereNot("status", "finished")
        .andWhere({ reservation_date })
        .orderBy("reservation_time", "asc");
}

async function search(mobile_number) {
    return knex("reservations")
        .whereRaw(
            "translate(mobile_number, '() -', '') like ?",
            `%${mobile_number.replace(/\D/g, "")}%`
        )
        .orderBy("reservation_date");
}

module.exports = {
    create,
    read,
    update,
    delete: destroy,
    list,
    search,
}
