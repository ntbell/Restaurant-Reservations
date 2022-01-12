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
    <main className="bg-light">
      <ErrorAlert error={loadError} />
      {loading && <p>loading...</p>}
      <h1 className="text-center"><u>Dashboard</u></h1>
      <div className="d-md-flex flex-column mb-3">
        <h4 className=" mb-0 text-center">Reservations</h4>
        <h3 className="text-center">{date}</h3>
        <div className="text-center mx-2 mb-2">
          <button className="btn btn-sm btn-info border border-dark date-buttons w-33" onClick={previousDay}>
            <span className="oi oi-arrow-left" />
            &nbsp;Previous
          </button>
          <button className="btn btn-sm btn-info border border-dark date-buttons w-33" onClick={() => history.push("/dashboard")}>
            Today
          </button>
          <button className="btn btn-sm btn-info border border-dark date-buttons w-33" onClick={nextDay}>
            Next&nbsp;
            <span className="oi oi-arrow-right" />
          </button>
        </div>
        {reservations.length > 0 ? <ReservationsDisplay reservations={reservations} reload={loadDashboard} setLoadError={setLoadError} /> : <h4 className="m-2 p-2 border border-dark rounded reservation-style text-center">No Reservations Today</h4>}
        <div className="d-flex flex-row flex-wrap">
          <TablesDisplay tables={tables} loadDashboard={loadDashboard} setLoadError={setLoadError} />
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
