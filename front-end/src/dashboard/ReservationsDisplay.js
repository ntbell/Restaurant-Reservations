import React from "react";
import { useHistory } from "react-router-dom";

function ReservationsDisplay({ reservations }) {
    const history = useHistory();

    const handleClick = async (reservation_id) => {
        history.push(`/reservations/${reservation_id}/seat`);
        //This probably shouldn't update to "seated" here??
        //await updateReservationStatus(reservation_id, "seated");
    }

    return reservations.map((reservation) => (
        <div key={reservation.reservation_id} className="d-flex flex-row justify-content-between border border-dark m-3">
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
            {reservation.status === "booked" ? (
                <button
                    type="button"
                    className="btn btn-primary pl-2"
                    href={`/reservations/${reservation.reservation_id}/seat`}
                    onClick={() => handleClick(reservation.reservation_id)}>
                    Seat
                </button>
            ) : (null)}
        </div>
    ));
}

export default ReservationsDisplay;