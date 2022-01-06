import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsDisplay from "./ReservationsDisplay";
import TablesDisplay from "./TablesDisplay";
import { useHistory, useLocation } from "react-router-dom";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date, table }) {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loadError, setLoadError] = useState(null);
  const [search, setSearch] = useState("");
  const [mobile_number, setMobile_number] = useState("");
  const history = useHistory();

  const usePathname = () => {
    const location = useLocation();
    return location.pathname;
  }

  //ToDo: Seems to work, but table here is only a prop to cause refresh
  //Can I do this some other way?  Table isn't used otherwise
  useEffect(loadDashboard, [date, mobile_number, table]);

  function loadDashboard() {
    const abortController = new AbortController();
    setLoadError(null);

    //Can consolidate?
    if (mobile_number) {
      listReservations({ mobile_number }, abortController.signal)
        .then(setReservations)
        .catch(setLoadError);
    } else {
      listReservations({ date }, abortController.signal)
        .then(setReservations)
        .catch(setLoadError);
    }

    listTables(abortController.signal)
      .then(setTables)
      .catch(setLoadError);
    return () => abortController.abort();
  }

  function changeHandler(event) {
    setSearch(event.target.value);
  }

  function submitHandler(event) {
    event.preventDefault();
    setMobile_number(search);
    setSearch("");
    history.push("/search");
  }

  //ToDo: Split this return into separate components
  //ToDo: Fix No reservations found displays while reservations is successfully loading
    //Could just use a "found" state and load "No reservations found" conditionally from that
  return (
    <main>
      <ErrorAlert error={loadError} />
      {usePathname().includes("search") && reservations.length === 0 ? (<h4 className="alert alert-danger text-center">No reservations found</h4>) : (null)}
      <h1>Dashboard</h1>
      <div className="d-md-flex flex-column mb-3">
        <div className="d-flex flex-row justify-content-between">
          <h4 className="mb-0">Reservations for date: {date}</h4>
          <form onSubmit={submitHandler}>
            <input
              id="mobile_number"
              name="mobile_number"
              placeholder="Enter a customer's phone number"
              value={search}
              onChange={changeHandler}
            />
            <button type="submit">Find</button>
          </form>
        </div>
        {reservations ? <ReservationsDisplay reservations={reservations} /> : null}
        {tables ? <TablesDisplay tables={tables} loadDashboard={loadDashboard} setLoadError={setLoadError} /> : null}
      </div>
    </main>
  );
}

export default Dashboard;
