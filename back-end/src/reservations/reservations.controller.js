const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function idExists(req, res, next) {
  const reservation_id = req.params.reservation_id;
  const reservation = await service.read(reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation 'reservation_id': ${reservation_id} cannot be found` });
}

async function errorConditions(req, res, next) {
  const date = req.body.data.reservation_date;
  const today = getToday();

  //if reservation date is a tuesday -- restaurant closed tuesdays
  //ToDo: TEST: .getDay() might not be returning the correct day
  const day = new Date(date).getDay();
  if(day === 1) {
    next({ status: 400, message: "Restaurant is closed on Tuesdays." });
  }
  
  //if reservation date is in the past
  const dateArray = date.split("-");
  const todayArray = today.split("-");
  for(let index in dateArray) {
    if(todayArray[index] < dateArray[index]) {
      return next();
    } else if(todayArray[index] > dateArray[index]) {
      next({ status: 400, message: "Reservations must be made for the future." });
    }
  }

  //ToDo: Check time constraints if same-day


  return next();
}

async function isFieldEmpty(req, res, next) {
  /*
    //ToDo: Refactor with this solution instead
    let reservation = {};
    {
      reservation.first_name = "", 
      reservation.last_name = "",
      reservation.mobile_number = "",
      reservation.reservation_date = "",
      reservation.reservation_time = "",
      reservation.people = 0,
    } = req.body.data;
    */

  if (!req.body.data) {
    next({ status: 400, message: "'data' is missing." });
  }

  const reservation = req.body.data;
  const fields = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"];

  if (Object.keys(reservation).length < 6) {
    for (let field of fields) {
      if (!reservation[field]) {
        next({ status: 400, message: `${field} is missing.` });
      }
    }
  }

  //If any empty or missing properties
  for (const [key, value] of Object.entries(reservation)) {
    if (value === "") {
      next({ status: 400, message: `${key} is empty.` });
    }
  }

  return next();
}

async function validateFields(req, res, next) {
  const reservation = req.body.data;
  const people = Number(reservation.people);
  const formattedDate = reservation["reservation_date"].replace(/-/g, "").trim();
  const formattedTime = reservation["reservation_time"].replace(/:/g, "").trim();
  let message;

  //HTTP request always sends input type="number" as string.  
  //test:1:backend fails because the test expects people="2" to fail, but this is exactly what the HTTP request sends from the front-end
  //Back-end tests pass if isNaN(people) is replaced with typeof(people) == "string"
  if (people <= 0 || isNaN(people)) {
    message = "people must be a number greater than 0";

  } else if(formattedDate.length !== 8) {
    message = "reservation_date must be 8 digits formatted yyyy-mm-dd.";

  } else if(formattedTime.length !== 4 && formattedTime.length !== 6) {
    message = "reservation_time must be 4 or 6 digits formatted xx:xx or xx:xx:xx";

  } else if(isNaN(formattedTime)) {
    message = "reservation_time must be a number";

  } else if(isNaN(formattedDate)) {
    message = "reservation_date must be a number";
    
  } else {
    
    return next();
  }

  next({ status: 400, message: message });
}

async function create(req, res, next) {
  const newReservation = req.body.data;
  //Need to cast string to integer
  //See above note about failing test for test:1:backend
  newReservation.people = parseInt(newReservation.people);
  res.status(201).json({ data: await service.create(newReservation) });
}

async function read(req, res) {
  res.json({ data: res.locals.reservation });
}

async function update() {
  const reservation_id = req.params.reservation_id;


}

async function destroy() {
  const reservation_id = req.params.reservation_id;

}

async function list(req, res) {
  const date = req.query.date;
  res.json({ data: await service.list(date) });
}

//Get todays date in yyyy-mm-dd with timezone offset
function getToday() {
  let yourDate = new Date();
  const offset = yourDate.getTimezoneOffset();
  yourDate = new Date(yourDate.getTime() - (offset*60*1000));
  return yourDate.toISOString().split('T')[0];
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(isFieldEmpty), asyncErrorBoundary(validateFields), asyncErrorBoundary(errorConditions), asyncErrorBoundary(create)],
  read: [asyncErrorBoundary(idExists), asyncErrorBoundary(read)],
  update: [asyncErrorBoundary(idExists), asyncErrorBoundary(update)],
  delete: [asyncErrorBoundary(idExists), asyncErrorBoundary(destroy)],
}