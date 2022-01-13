import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";
import { readReservation, updateReservation } from "../utils/api";

function EditReservation() {
    const history = useHistory();
    const { reservation_id } = useParams();
    const [error, setError] = useState(null);
    const [reservation, setReservation] = useState(null);

    useEffect(loadReservation, [reservation_id]);

    function loadReservation() {
        const abortController = new AbortController();
        setError(null);
        readReservation(reservation_id, abortController.signal)
            .then(setReservation)
            .catch(setError);

        return () => abortController.abort();
    }

    function submitHandler(updatedReservation) {
        setError(null);
        updatedReservation.people = parseInt(updatedReservation.people);

        updateReservation(reservation_id, updatedReservation)
            .then(() => history.push(`/dashboard?date=${updatedReservation.reservation_date}`))
            .catch(setError);
    }

    function onCancel() {
        history.goBack();
    }

    return (
        <div>
            <ErrorAlert error={error} />
            {reservation ?
                <ReservationForm reservation={reservation} setReservation={setReservation} onSubmit={submitHandler}>
                    <div>
                        <button type="button" className="btn btn-sm btn-secondary rounded" onClick={onCancel}>
                            <span className="oi oi-x" /> Cancel
                        </button>
                        <button type="submit" className="btn btn-sm btn-primary rounded">
                            <span className="oi oi-check" /> Submit
                        </button>
                    </div>
                </ReservationForm> : null}
        </div>
    );
}

export default EditReservation;