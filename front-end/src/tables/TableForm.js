import React from "react";

function TableForm({
    table = {
        table_name: "",
        capacity: 0,
    },
    setTable,
    onSubmit,
    children,
}) {

    function changeHandler({ target: { name, value } }) {
        setTable((previousTable) => ({
            ...previousTable,
            [name]: value,
        }));
    }

    function submitHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        onSubmit(table);
    }

    return (
        <form onSubmit={submitHandler}>
            <div className="form-group">
                <label htmlFor="table_name">Table name:</label>
                <input
                    type="text"
                    className="form-control"
                    id="table_name"
                    name="table_name"
                    required={true}
                    value={table.table_name}
                    onChange={changeHandler}
                />
            </div>
            <div className="form-group">
                <label htmlFor="capacity">Table Capacity:</label>
                <input
                    type="number"
                    className="form-control"
                    id="capacity"
                    name="capacity"
                    required={true}
                    value={table.capacity}
                    onChange={changeHandler}
                />
            </div>
            <div className="form-row">{children}</div>
        </form>
    );
}

export default TableForm;