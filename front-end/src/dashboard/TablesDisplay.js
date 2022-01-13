import React from "react";
import { unseatReservation } from "../utils/api";

function TablesDisplay({ tables, loadDashboard, setLoadError }) {

    const askConfirmation = async (table) => {
        const table_id = table.table_id;
        if (window.confirm("Is this table ready to seat new guests?")) {
            setLoadError(null);
            unseatReservation(table_id).then(loadDashboard).catch(setLoadError);
        }
    }

    const formattedTables = tables.map((table) => (
        <div key={table.table_id} className="d-flex flex-column justify-content-between border border-dark rounded table-style m-2">
            <p className="p-1 h-25 text-center">Table Name: {table.table_name}</p>
            <p className="p-1 h-25 text-center">Capacity: {table.capacity}</p>
            <div className="divider div-transparent"></div>
            <p className="p-1 pt-3 h-25 text-center" data-table-id-status={table.table_id}>
                {table.reservation_id ? ("Occupied") : ("Free")}
            </p>
            {table.reservation_id ?
                <button
                    name="finish"
                    className="p-1 h-25 btn btn-secondary btn-block"
                    data-table-id-finish={table.table_id}
                    onClick={() => askConfirmation(table)}>
                    Finish
                </button>
                : <div className="h-25"></div>}
        </div>
    ));

    return (<div className="d-flex flex-row flex-wrap">{formattedTables}</div>);
}

export default TablesDisplay;