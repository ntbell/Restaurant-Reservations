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

async function update(reservation_id) {
    return knex("reservations")
        .select("*")
        .where({ "reservation_id": newReservation.reservation_id })
        .update(newReservation)
        .then((data) => data[0]);
}

async function destroy(reservation_id) {
    return knex("reservations").where({ reservation_id }).del();
}

async function list(reservation_date) {
    return knex("reservations")
        .where({ reservation_date })
        .orderBy("reservation_time", "asc");
}

module.exports = {
    create,
    read,
    update,
    delete: destroy,
    list,
}
