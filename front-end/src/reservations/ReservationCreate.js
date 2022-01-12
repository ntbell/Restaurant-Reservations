import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function ReservationCreate({ reservation, setReservation, onSubmit }) {
    const history = useHistory();
    const [error, setError] = useState(null);

    function submitHandler(reservation) {
        setError(null);
        reservation.people = parseInt(reservation.people);
        createReservation(reservation).then(onSubmit).catch(setError);
    }

    function onCancel() {
        history.goBack();
    }

    return (
        <div>
            <ErrorAlert error={error} />
            <ReservationForm reservation={reservation} setReservation={setReservation} onSubmit={submitHandler}>
                <div>
                    <button type="button" className="btn btn-sm btn-secondary rounded" onClick={onCancel}>
                        <span className="oi oi-x" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-primary rounded">
                        <span className="oi oi-check" /> Submit
                    </button>
                </div>
            </ReservationForm>
        </div>
    );
}

export default ReservationCreate;