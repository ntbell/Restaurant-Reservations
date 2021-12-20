import React, { useState } from "react";

import { Redirect, Route, Switch, useHistory } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import ReservationCreate from "../reservations/ReservationCreate";
import { today } from "../utils/date-time";
import { useLocation } from 'react-router-dom';

const useQuery = () => new URLSearchParams(useLocation().search);

const initialState = {
  first_name: "",
  last_name: "",
  mobile_number: "",
  reservation_date: "",
  reservation_time: "",
  people: 0,
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
  let query = useQuery();
  const date = query.get("date") || today();


  const history = useHistory();
  const [reservation, setReservation] = useState({ ...initialState });

  function onSubmit(newReservation) {
    setReservation({ ...initialState });
    history.push(`/dashboard?date=${newReservation.reservation_date}`);
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
        <Dashboard date={date} />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

export default Routes;
