import React from "react";
import { useHistory } from "react-router-dom";
import { previous, next } from "../utils/date-time";

function DateButtons({ date }) {
    const history = useHistory();
    const previousDay = () => history.push(`/dashboard?date=${previous(date)}`);
    const nextDay = () => history.push(`/dashboard?date=${next(date)}`);

    return (
        <div role="group" className="text-center mx-2 mb-2">
            <button className="btn btn-sm btn-info border border-dark date-buttons" onClick={previousDay}>
                <span className="oi oi-arrow-left" />
                &nbsp;Previous
            </button>
            <button className="btn btn-sm btn-info border border-dark date-buttons" onClick={() => history.push("/dashboard")}>
                Today
            </button>
            <button className="btn btn-sm btn-info border border-dark date-buttons" onClick={nextDay}>
                Next&nbsp;
                <span className="oi oi-arrow-right" />
            </button>
        </div>
    );
}

export default DateButtons;