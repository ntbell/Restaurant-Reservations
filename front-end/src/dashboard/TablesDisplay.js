import React from "react";
import { unseatReservation } from "../utils/api";

function TablesDisplay({ tables, loadDashboard, setLoadError }) {

    const askConfirmation = async (table) => {
        const table_id = table.table_id;

        if(window.confirm("Is this table ready to seat new guests?")) {
            setLoadError(null);
            unseatReservation(table_id).then(loadDashboard).catch(setLoadError);
        }
    }

    return tables.map((table) => (
        <div key={table.table_id} className="d-flex flex-column justify-content-between border border-dark rounded table-style m-3">
            <p className="p-1">Table Name: {table.table_name}</p>
            <p className="p-1">Capacity: {table.capacity}</p>
            <p className="p-1" data-table-id-status={table.table_id}>
                {table.reservation_id ? ("Occupied") : ("Free")}
            </p>
            {table.reservation_id ? (
              <button 
                name="finish"
                className="p-1"
                data-table-id-finish={table.table_id}
                onClick={() => askConfirmation(table)}>
                    Finish
                </button>  
            ) : (null)}
        </div>
    ));
}

export default TablesDisplay;