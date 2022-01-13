import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom"
import { listTables, readReservation, seatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsDisplay from "../dashboard/ReservationsDisplay";


function SeatReservation() {
    const history = useHistory();
    const { reservation_id } = useParams();
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([]);
    const [tableId, setTableId] = useState(1); //ToDo: What to initialize as?
    const [reservation, setReservation] = useState(null);

    useEffect(loadInformation, [reservation_id]);

    function loadInformation() {
        const abortController = new AbortController();
        setError(null);

        readReservation(reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError);
        listTables(abortController.signal)
            .then(setTables)
            .catch(setError);

        return () => abortController.abort();
    }

    function changeHandler(event) {
        setTableId(event.target.value);
    }

    function submitHandler(event) {
        event.preventDefault();
        setError(null);
        
        seatReservation(reservation_id, tableId)
            .then(() => history.push("/dashboard"))
            .catch(setError)
    }

    function onCancel() {
        history.goBack();
    }

    return (
        <div>
            <ErrorAlert error={error} />
            <h4 className="m-2">Seating reservation: </h4>
            {reservation ? <ReservationsDisplay reservations={[reservation]} /> : null}
            <form onSubmit={submitHandler}>
                <label className="m-2">
                    Table number: 
                    <select className="ml-2" name="table_id" value={tableId} onChange={changeHandler}>
                        {tables ?
                            tables.map((table) => (
                                <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                            )) : (null)}
                    </select>
                </label>
                <div className="form-row ml-2 mt-2 mb-4">
                    <button type="button" className="btn btn-sm btn-secondary rounded" onClick={onCancel}>
                        <span className="oi oi-x" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-primary rounded">
                        <span className="oi oi-check" /> Submit
                    </button>
                </div> 
            </form>
        </div>
    );
}


export default SeatReservation;