import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom"
import { listTables, seatReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function SeatReservation() {
    const history = useHistory();
    const { reservation_id } = useParams();
    const [error, setError] = useState(null);
    const [tables, setTables] = useState([]);
    const [tableId, setTableId] = useState(1);

    useEffect(loadTables, [reservation_id]);

    function loadTables() {
        const abortController = new AbortController();
        setError(null);
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
            <form onSubmit={submitHandler}>
                <label>
                    Table number:
                    <select name="table_id" value={tableId} onChange={changeHandler}>
                        {tables ?
                            tables.map((table) => (
                                <option key={table.table_id} value={table.table_id}>{table.table_name} - {table.capacity}</option>
                            )) : (null)}
                    </select>
                </label>
                <div>
                    <button type="button" onClick={onCancel}>
                        <span className="oi oi-x" /> Cancel
                    </button>
                </div>
                <div>
                    <button type="submit" >
                        <span className="oi oi-check" /> Submit
                    </button>
                </div>
            </form>
        </div>
    );
}


export default SeatReservation;