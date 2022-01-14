const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");


//Validates that the reservation_id exists and sets the reservation to res.locals.reservation
async function idExists(req, res, next) {
  const reservation_id = req.params.reservation_id;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation 'reservation_id': ${reservation_id} cannot be found.` });
}


//Checks that the request has a body.data property
async function hasBody(req, res, next) {
  if (!req.body.data) {
    next({ status: 400, message: "Request must include a body." });
  }
  return next();
}


//Validates that all fields are present in body and have values
async function isFieldEmpty(req, res, next) {
  const reservation = req.body.data;
  //Doesn't include 'status' because every reservation is initialized with status="booked"
  const fields = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];

  if (Object.keys(reservation).length < 6) {
    for (let field of fields) {
      if (!reservation[field]) {
        next({ status: 400, message: `${field} is missing.` });
      }
    }
  }

  for (const [key, value] of Object.entries(reservation)) {
    if (value === "") {
      next({ status: 400, message: `${key} is empty.` });
    }
  }

  return next();
}


//Validates that all fields follow rules before creating/updating reservation
async function validateFields(req, res, next) {
  const reservation = req.body.data;
  const formattedDate = reservation["reservation_date"].replace(/-/g, "").trim();
  const formattedTime = reservation["reservation_time"].replace(/:/g, "").trim();
  let message;

  if (reservation.people <= 0 || typeof (reservation.people) !== "number") {
    message = "people must be a number greater than 0";

  } else if (formattedDate.length !== 8) {
    message = "reservation_date must be 8 digits formatted yyyy-mm-dd.";

  } else if (formattedTime.length !== 4 && formattedTime.length !== 6) {
    message = "reservation_time must be 4 or 6 digits formatted xx:xx or xx:xx:xx";

  } else if (isNaN(formattedTime)) {
    message = "reservation_time must be a number";

  } else if (isNaN(formattedDate)) {
    message = "reservation_date must be a number";

  } else if (reservation.status === "seated" || reservation.status === "finished") {
    message = "reservation status must be initialized as 'booked', not 'seated' or 'finished.'";

  } else {
    return next();
  }
  next({ status: 400, message: message });
}


//Validates the status of the reservation before updating
async function checkStatus(req, res, next) {
  const validOptions = ["booked", "seated", "finished", "cancelled"];
  const reservation = res.locals.reservation;
  let message;

  if (!req.body.data.status) {
    message = "Status is unknown";
  }

  const status = req.body.data.status;
  if (!validOptions.includes(status)) {
    message = "Status is unknown.";
  } else if (reservation.status === "finished") {
    message = "Cannot update a finished reservation.";
  }

  if (message) {
    next({ status: 400, message: message });
  } else {
    return next();
  }
}


//Validates that the date/time fall within constraints
async function dateTimeConditions(req, res, next) {
  const date = req.body.data.reservation_date;
  const today = getToday();

  //If date is a Tuesday -- Restaurant closed
  const day = new Date(date).getUTCDay();
  if (day === 2) {
    next({ status: 400, message: "Restaurant is closed on Tuesdays." });
  }

  const time = req.body.data.reservation_time;
  const currTime = getTime();

  if (time < "10:30") {
    next({ status: 400, message: "Cannot make reservations before 10:30a." });

  } else if (time > "21:30") {
    next({ status: 400, message: "Cannot make reservations after 9:30p." });

  } else {
    const dateArray = date.split("-");
    const todayArray = today.split("-");

    //If same-day and current time is later than reservation time
    if (todayArray[0] == dateArray[0] && todayArray[1] == dateArray[1] && todayArray[2] == dateArray[2] && currTime >= time) {
      next({ status: 400, message: "Reservations must be made for the future." });
    }

    //If different days, make sure reservation is in future
    for (let index in dateArray) {
      if (todayArray[index] < dateArray[index]) {
        return next();
      } else if (todayArray[index] > dateArray[index]) {
        next({ status: 400, message: "Reservations must be made for the future." });
      }
    }
  }
  return next();
}


//Creates a new reservation
async function create(req, res) {
  const newReservation = req.body.data;
  res.status(201).json({ data: await service.create(newReservation) });
}


//Returns existing reservation
async function read(req, res) {
  res.json({ data: res.locals.reservation });
}


//Updates and returns the whole reservation
async function update(req, res) {
  const newReservation = {
    ...res.locals.reservation,
    ...req.body.data,
  }
  res.json({ data: await service.update(newReservation) });
}


//Updates and returns only the status of the reservation
async function updateStatus(req, res) {
  const newReservation = {
    ...res.locals.reservation,
    status: req.body.data.status,
  }
  res.json({ data: { status: await service.updateStatus(newReservation) } });
}


//Lists all reservations with either date or mobile_number query
async function list(req, res) {
  const { date, mobile_number } = req.query;

  date ?
    res.json({ data: await service.list(date) })
    :
    res.json({ data: await service.search(mobile_number) });
}


//Get todays date in yyyy-mm-dd with timezone offset
function getToday() {
  let yourDate = new Date();
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - (offset * 60 * 1000));
  return yourDate.toISOString().split('T')[0];
}


//Get current time in hh:mm
function getTime() {
  const date = new Date();
  let hours = date.getHours().toString();
  let minutes = date.getMinutes().toString();

  //Prepend 0 for testing '>' or '<' in dateTimeConditions()
  if (hours.length === 1) hours = "0" + hours;
  if (minutes.length === 1) minutes = "0" + minutes;

  return `${hours}:${minutes}`;
}


module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(hasBody), asyncErrorBoundary(isFieldEmpty), asyncErrorBoundary(validateFields), asyncErrorBoundary(dateTimeConditions), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(idExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(idExists), asyncErrorBoundary(hasBody), asyncErrorBoundary(isFieldEmpty), asyncErrorBoundary(validateFields), asyncErrorBoundary(update)],
  updateStatus: [asyncErrorBoundary(idExists), asyncErrorBoundary(hasBody), asyncErrorBoundary(checkStatus), asyncErrorBoundary(updateStatus)],
}