import React from "react";

function TablesDisplay({ tables }) {
    return tables.map((table) => (
        <div key={table.table_id} className="d-flex flex-row justify-content-between border border-dark m-3">
            <p className="p-2">Table Name: {table.table_name}</p>
            <p className="p-2">Capacity: {table.capacity}</p>
            <p className="p-2" data-table-id-status={table.table_id}>
                {table.reservation_id ? ("Occupied") : ("Free")}
            </p>
        </div>
    ));
}

export default TablesDisplay;