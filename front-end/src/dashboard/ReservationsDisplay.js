import React from "react";
import { useHistory } from "react-router-dom";
import { updateReservationStatus } from "../utils/api";

function ReservationsDisplay({ reservations, reload, setLoadError }) {
    const history = useHistory();

    const askConfirmation = async (reservation) => {
        const reservation_id = reservation.reservation_id;

        if (window.confirm("Do you want to cancel this reservation? This cannot be undone.")) {
            setLoadError(null);
            updateReservationStatus(reservation_id, "cancelled").then(reload).catch(setLoadError);
        }
    }

    return reservations.map((reservation) => (
        <div key={reservation.reservation_id} className="d-flex flex-row justify-content-between border border-dark rounded reservation-style m-3">
            <p className="p-2">First Name: {reservation.first_name}</p>
            <p className="p-2">Last Name: {reservation.last_name}</p>
            <p className="p-2">Mobile Number: {reservation.mobile_number}</p>
            <p className="p-2">Date: {reservation.reservation_date}</p>
            <p className="p-2">Time: {reservation.reservation_time}</p>
            <p className="p-2">People: {reservation.people}</p>
            <p className="p-2"
                data-reservation-id-status={reservation.reservation_id}>
                Status: {reservation.status}
            </p>
            <div className="d-flex pl-2">
                {reservation.status === "booked" ? (
                    <button
                        type="button"
                        className="btn btn-light"
                        href={`/reservations/${reservation.reservation_id}/edit`}
                        onClick={() => history.push(`/reservations/${reservation.reservation_id}/edit`)}>
                        Edit
                    </button>
                ) : (null)}
                {reservation.status === "booked" ? (
                    <button
                        type="button"
                        className="btn btn-primary"
                        href={`/reservations/${reservation.reservation_id}/seat`}
                        onClick={() => history.push(`/reservations/${reservation.reservation_id}/seat`)}>
                        Seat
                    </button>
                ) : (null)}
                <button
                    type="button"
                    className="btn btn-secondary"
                    data-reservation-id-cancel={reservation.reservation_id}
                    onClick={() => askConfirmation(reservation)}>
                    Cancel
                </button>
            </div>
        </div>
    ));
}

export default ReservationsDisplay;