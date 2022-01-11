import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsDisplay from "./ReservationsDisplay";
import TablesDisplay from "./TablesDisplay";
import { previous, today, next } from "../utils/date-time";
import { useHistory } from "react-router-dom";

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
  const [loading, setLoading] = useState(true);
  const history = useHistory();
  const previousDay = () => history.push(`/dashboard?date=${previous(date)}`);
  const nextDay = () => history.push(`/dashboard?date=${next(date)}`);

  //ToDo: Seems to work, but table here is only a prop to cause refresh
  //Can I do this some other way?  Table isn't used otherwise
  useEffect(loadDashboard, [date, table]);

  function loadDashboard() {
    const abortController = new AbortController();
    setTables([]);
    setReservations([]);
    setLoadError(null);
    setLoading(true);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setLoadError);
    listTables(abortController.signal)
      .then(setTables)
      .catch(setLoadError);

    setLoading(false);
    return () => abortController.abort();
  }

  return (
    <main>
      <ErrorAlert error={loadError} />
      {loading && <p>loading...</p>}
      <h1>Dashboard</h1>
      <div>
        <button onClick={previousDay}>Previous</button>
        <button onClick={() => history.push("/dashboard")}>Today</button>
        <button onClick={nextDay}>Next</button>
      </div>
      <div className="d-md-flex flex-column mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
        {reservations.length > 0 ? <ReservationsDisplay reservations={reservations} reload={loadDashboard} setLoadError={setLoadError} /> : <h4 className="mt-2 p-2 border border-dark rounded reservation-style text-center">No Reservations Today</h4>}
        <h4 className="">Tables: </h4>
        <div className="d-flex flex-row">
          <TablesDisplay tables={tables} loadDashboard={loadDashboard} setLoadError={setLoadError} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
