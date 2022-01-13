# Periodic Tables

[Link to live application](https://restaurant-res-ntbell-client.herokuapp.com)

## Summary

A restaurant reservation system designed to display, manage, and pair together reservations and tables. The software is used only by restaurant personnel when a customer calls to request a reservation. At this point, the customers will not access the system online.

### Installation Instructions

1. Fork and clone this repository.
2. Run cp ./back-end/.env.sample ./back-end/.env.
3. Update the ./back-end/.env file with the connection URL's to your database instance.
4. Run cp ./front-end/.env.sample ./front-end/.env.
5. You should not need to make changes to the ./front-end/.env file unless you want to connect to a backend at a location other than `http://localhost:5000`.
6. Run npm install to install project dependencies.
7. Run npm run start:dev to start your server in development mode.

### Testing

`npm test` runs all tests,
`npm run test:X` runs test X
`npm run test:backend` runs all backend tests
`npm run test:frontend` runs all frontend tests
`npm run test:X:backend` runs only the backend test X
`npm run test:X:frontend` runs only the frontend test X
`npm run test:e2e` runs only the end-to-end tests

### API Documentation

`/reservations`
  **GET** - Given a query `/reservations?date=yyyy-mm-dd` or `/reservations?mobile_number=xxx-xxx-xxxx`, returns all reservations with matching data.
  **POST** - Creates a new reservation

`/reservations/:reservation_id`
  **GET** - Retrieves the reservation by id
  **PUT** - Updates the reservation

`/reservations/:reservation_id/status`
  **PUT** - Updates the status of the reservation to `seated` `finished`, or `cancelled`

`/tables`
  **GET** - Retrieves all tables
  **POST** - Creates a new table

`/tables/:table_id`
  **GET** - Retrieves the table by id

`/tables/:table_id/seat`
  **PUT** - Updates the table to reference the reservation and updates the reservation to `status: "seated"`
  **DELETE** - Updates the reservation to `status: "finished" and the table's reference to the reservation to `reservation_id: null`

### Screenshots

![Dashboard example](./front-end/.screenshots/us-08-edit-reservation-submit-after.png?raw=true "Dashboard view")

![Seating example 1, post-seat-click](./front-end/.screenshots/us-04-seat-capacity-reservation-submit-before.png?raw=true "Seating action")

![Seating example 2, banner alert](./front-end/.screenshots/us-04-seat-capacity-reservation-submit-after.png?raw=true "Banner alerts for input validation")

![Seating example 3, post-seat-submit](./front-end/.screenshots/us-04-seat-reservation-submit-after.png?raw=true "Dashboard after seating")

![Form example](./front-end/.screenshots/us-08-edit-reservation-cancel-before.png?raw=true "Form example - Editing reservation")

### Technology

This project is a full-stack app developed using React.js, CSS, Node.js, Express, and PostgreSQL.

It is currently deployed to [Heroku](https://restaurant-res-ntbell-client.herokuapp.com) and the timezone is set to `TZ=America/Chicago`.