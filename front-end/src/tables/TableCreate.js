import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import TableForm from "./TableForm";

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
        <div>
            <ErrorAlert error={error} />
            <TableForm table={table} setTable={setTable} onSubmit={submitHandler}>
                <div>
                    <button type="button" onClick={onCancel}>
                        <span className="oi oi-x" /> Cancel
                    </button>
                </div>
                <div>
                    <button type="submit" >
                        <span className="oi oi-check" /> Submit
                    </button>
                </div>
            </TableForm>
        </div>
    );
}

export default TableCreate;