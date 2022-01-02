import React from "react";
import { useHistory } from "react-router-dom";

function ReservationsDisplay({ reservations }) {
    const history = useHistory();

    return reservations.map((reservation) => (
        <div key={reservation.reservation_id} className="d-flex flex-row justify-content-between border border-dark m-3">
            <p className="p-2">First Name: {reservation.first_name}</p>
            <p className="p-2">Last Name: {reservation.last_name}</p>
            <p className="p-2">Mobile Number: {reservation.mobile_number}</p>
            <p className="p-2">Date: {reservation.reservation_date}</p>
            <p className="p-2">Time: {reservation.reservation_time}</p>
            <p className="p-2">People: {reservation.people}</p>
            <button 
                type="button" 
                className="btn btn-primary pl-2" 
                href={`/reservations/${reservation.reservation_id}/seat`}
                onClick={() => history.push(`/reservations/${reservation.reservation_id}/seat`)}>
                Seat
            </button>
        </div>
    ));
}

export default ReservationsDisplay;