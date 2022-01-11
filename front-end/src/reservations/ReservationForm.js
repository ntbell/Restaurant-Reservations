import React from "react";

function ReservationForm({
    reservation = {
        first_name: "",
        last_name: "",
        mobilePhone: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
        status: "booked",
    },
    setReservation,
    onSubmit,
    children,
}) {
    function changeHandler({ target: { name, value } }) {
        setReservation((previousReservation) => ({
            ...previousReservation,
            [name]: value,
        }));
    }

    function submitHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        onSubmit(reservation);
    }    

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label htmlFor="first_name">First name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="first_name"
                    name="first_name"
                    required={true}
                    value={reservation.first_name}
                    onChange={changeHandler}
                />
            </div>
            <div className="form-group">
                <label htmlFor="last_name">Last name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="last_name"
                    name="last_name"
                    required={true}
                    value={reservation.last_name}
                    onChange={changeHandler}
                />
            </div>
            <div className="form-group">
                <label htmlFor="mobile_number">Mobile Number:</label>
                <input
                    type="text"
                    className="form-control"
                    id="mobile_number"
                    name="mobile_number"
                    required={true}
                    value={reservation.mobile_number}
                    onChange={changeHandler}
                />
            </div>
            <div className="form-group">
                <label htmlFor="reservation_date">Reservation date:</label>
                <input
                    type="date"
                    className="form-control"
                    id="reservation_date"
                    name="reservation_date"
                    required={true}
                    placeholder="YYYY-MM-DD"
                    pattern="\d{4}-\d{2}-\d{2}"
                    value={reservation.reservation_date}
                    onChange={changeHandler}
                />
            </div>
            <div className="form-group">
                <label htmlFor="reservation_time">Reservation time:</label>
                <input
                    type="time"
                    className="form-control"
                    id="reservation_time"
                    name="reservation_time"
                    required={true}
                    placeholder="HH:MM"
                    pattern="[0-9]{2}:[0-9]{2}"
                    value={reservation.reservation_time}
                    onChange={changeHandler}
                />
            </div>
            <div className="form-group">
                <label htmlFor="people">Number of people:</label>
                <input
                    type="number"
                    className="form-control"
                    id="people"
                    name="people"
                    required={true}
                    value={reservation.people}
                    onChange={changeHandler}
                />
            </div>
            <div className="form-row">{children}</div>
        </form>
    );
}

export default ReservationForm;