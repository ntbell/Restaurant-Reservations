const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const { table } = require("../db/connection");

async function idExists(req, res, next) {
  const table_id = req.params.table_id;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  }
  next({ status: 404, message: `Table 'table_id': ${table_id} cannot be found` });
}

async function reservationIdExists(req, res, next) {
  if (!req.body.data) {
    next({ status: 400, message: "'data' is missing." });
  }

  const { reservation_id } = req.body.data;
  if (!reservation_id) {
    next({ status: 400, message: "Must include reservation_id." });
  }

  const reservation = await service.readReservation(Number(reservation_id));
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation 'reservation_id': ${reservation_id} cannot be found` });
}

async function isFieldEmpty(req, res, next) {
  if (!req.body.data) {
    next({ status: 400, message: "'data' is missing." });
  }

  const table = req.body.data;
  const fields = ["table_name", "capacity"];

  if (Object.keys(table).length < 2) {
    for (let field of fields) {
      if (!table[field]) {
        next({ status: 400, message: `${field} is missing.` });
      }
    }
  }

  //If any empty or missing properties
  for (const [key, value] of Object.entries(table)) {
    if (value === "") {
      next({ status: 400, message: `${key} is empty.` });
    }
  }

  return next();
}

async function validateFields(req, res, next) {
  const table = req.body.data;
  let message;

  if (table.capacity <= 0 || typeof(table.capacity) !== "number") {
    message = "Table capacity must be a number greater than 0";

  } else if (table.table_name.length < 2) {
    message = "table_name must be 2 characters or longer.";

  } else {
    return next();
  }

  next({ status: 400, message: message });
}

async function create(req, res) {
  const newTable = req.body.data;
  res.status(201).json({ data: await service.create(newTable) });
}

async function read(req, res) {
  res.json({ data: res.locals.table });
}

async function validateSeating(req, res, next) {
  const table = res.locals.table;
  const reservation = res.locals.reservation;
  let message;

  if (reservation.people > table.capacity) {
    message = "Table does not have sufficient capacity.";
  } else if (table.reservation_id !== null) {
    message = "Table is already occupied.";
  } else if (reservation.status === "seated") {
    message = "Reservation is already seated.";
  }

  if (message) {
    next({ status: 400, message: message });
  } else {
    return next();
  }
}

async function update(req, res) {
  const newTable = {
    ...res.locals.table,
    ...req.body.data,
  }
  const newReservation = {
    ...res.locals.reservation,
    status: "seated",
  }
  //ToDo: Fix in service with knex.transactions
  await service.updateReservationStatus(newReservation);
  res.status(200).json({ data: await service.update(newTable) });
}

async function tableOccupied(req, res, next) {
  if(res.locals.table.reservation_id == null) {
    next({ status: 400, message: `table ${res.locals.table.table_id} is not occupied.`});
  }
  return next();
}

async function destroy(req, res) {
  const newTable = {
    ...res.locals.table,
    reservation_id: null
  }

  const reservation_id = res.locals.table.reservation_id;
  const reservation = await service.readReservation(Number(reservation_id));
  const newReservation = {
    ...reservation,
    status: "finished",
  }
  await service.updateReservationStatus(newReservation);
  
  res.json({ data: await service.update(newTable) });
}

async function list(req, res) {
  res.json({ data: await service.list() });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(isFieldEmpty), asyncErrorBoundary(validateFields), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(idExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(idExists), asyncErrorBoundary(reservationIdExists), asyncErrorBoundary(validateSeating), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(idExists), asyncErrorBoundary(tableOccupied), asyncErrorBoundary(destroy)],
}