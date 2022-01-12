import React, { useState, useEffect } from "react";
import ReservationsDisplay from "./ReservationsDisplay";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function Search() {
    const [mobile_number, setMobile_number] = useState("");
    const [search, setSearch] = useState("");
    const [reservations, setReservations] = useState([]);
    const [loadError, setLoadError] = useState(null);

    useEffect(loadReservations, [mobile_number]);

    function loadReservations() {
        const abortController = new AbortController();
        setLoadError(null);

        listReservations({ mobile_number }, abortController.signal)
            .then(setReservations)
            .catch(setLoadError);

        return () => abortController.abort();
    }

    function changeHandler(event) {
        setSearch(event.target.value);
    }

    function submitHandler(event) {
        event.preventDefault();
        setMobile_number(search);
    }

    return (
        <div>
            <ErrorAlert error={loadError} />
            {mobile_number && reservations.length === 0 ? (<h4 className="alert alert-danger text-center">No reservations found</h4>) : (null)}
            <form onSubmit={submitHandler}>
                <label className="m-2">Search: </label>
                <input
                    className="search-input my-2"
                    id="mobile_number"
                    name="mobile_number"
                    placeholder="Enter a customer's phone number"
                    value={search}
                    onChange={changeHandler}
                />
                <button type="submit">Find</button>
            </form>
            <ReservationsDisplay reservations={reservations} reload={loadReservations} setLoadError={setLoadError} />
        </div>
    );
}

export default Search;