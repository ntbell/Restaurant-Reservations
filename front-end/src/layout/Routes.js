import React, { useEffect, useState } from "react";

import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationCreate from "../reservations/ReservationCreate";
import TableCreate from "../tables/TableCreate";
import SeatReservation from "../reservations/SeatReservation";
import Search from "../dashboard/Search";
import EditReservation from "../dashboard/EditReservation";
import { today } from "../utils/date-time";
import { useLocation } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

const initialReservation = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "",
  people: 0,
  status: "booked",
};

const initialTable = {
  table_name: "",
  capacity: 0,
};

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
function Routes() {
  //Pulls the query from the url.  ex. /dashboard?date=2021-01-01 returns 2021-01-01
  const query = useQuery();
  const date = query.get("date") || today();

  //ToDo: Implement next and previous for days
  //use utils/date-time for implementation
  const history = useHistory();
  const [reservation, setReservation] = useState({ ...initialReservation });
  const [table, setTable] = useState({ ...initialTable });

  function onSubmit(response) {
    if (response.reservation_date) {
      history.push(`/dashboard?date=${reservation.reservation_date}`);
    } else {
      history.push("/dashboard");
    }
    setTable({ ...initialTable });
    setReservation({ ...initialReservation });
  }

  return (
    <Switch>
      <Route exact={true} path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact={true} path="/reservations/new">
        <ReservationCreate reservation={reservation} setReservation={setReservation} onSubmit={onSubmit} />
      </Route>
      <Route exact={true} path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard date={date} table={table} key={document.location.href} />
      </Route>
      <Route path="/search">
        <Search />
      </Route>
      <Route path="/tables/new">
        <TableCreate table={table} setTable={setTable} onSubmit={onSubmit} />
      </Route>
      <Route path="/reservations/:reservation_id/seat">
        <SeatReservation />
      </Route>
      <Route path="/reservations/:reservation_id/edit">
        <EditReservation />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
