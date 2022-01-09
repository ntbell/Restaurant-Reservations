import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsDisplay from "./ReservationsDisplay";
import TablesDisplay from "./TablesDisplay";

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
      <div className="d-md-flex flex-column mb-3">
        <h4 className="mb-0">Reservations for date: {date}</h4>
        <ReservationsDisplay reservations={reservations} />
        <TablesDisplay tables={tables} loadDashboard={loadDashboard} setLoadError={setLoadError} />
      </div>
    </main>
  );
}

export default Dashboard;
