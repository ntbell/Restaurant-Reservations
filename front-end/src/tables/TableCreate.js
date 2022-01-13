import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import TableForm from "./TableForm";
import { createTable } from "../utils/api";

function TableCreate({ table, setTable, onSubmit }) {
    const history = useHistory();
    const [error, setError] = useState(null);

    function submitHandler(table) {
        setError(null);
        table.capacity = parseInt(table.capacity);
        createTable(table).then(onSubmit).catch(setError);
    }

    function onCancel() {
        history.goBack();
    }

    return (
        <main>
            <ErrorAlert error={error} />
            <h2 className="text-center"><u>New Table</u></h2>
            <TableForm table={table} setTable={setTable} onSubmit={submitHandler}>
                <div role="group">
                    <button type="button" className="btn btn-sm btn-secondary rounded" onClick={onCancel}>
                        <span className="oi oi-x" /> Cancel
                    </button>
                    <button type="submit" className="btn btn-sm btn-primary rounded">
                        <span className="oi oi-check" /> Submit
                    </button>
                </div>
            </TableForm>
        </main>
    );
}

export default TableCreate;