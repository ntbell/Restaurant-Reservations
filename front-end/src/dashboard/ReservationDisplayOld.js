import React from "react";
import { Link } from "react-router-dom";

//ToDo: Fix href problem??
//href should only be used for aboslute full paths in react
//use react's built in link and router for relative paths

//ToDo: Combine with TableDisplay
function ReservationDisplay({ reservations }) {
    return reservations.map((reservation) => (
        <div key={reservation.reservation_id} className="d-flex flex-row justify-content-between border border-dark m-3">
            <p className="p-2">First Name: {reservation.first_name}</p>
            <p className="p-2">Last Name: {reservation.last_name}</p>
            <p className="p-2">Mobile Number: {reservation.mobile_number}</p>
            <p className="p-2">Date: {reservation.reservation_date}</p>
            <p className="p-2">Time: {reservation.reservation_time}</p>
            <p className="p-2">People: {reservation.people}</p>
            <Link className="pl-2" to={`/reservations/${reservation.reservation_id}/seat`}>
                <button type="button" className="btn btn-primary" href={`/reservations/${reservation.reservation_id}/seat`}>Seat</button>
            </Link>
        </div>
    ));
}

export default ReservationDisplay;