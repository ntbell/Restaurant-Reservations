exports.up = function (knex) {
    return knex.schema.createTable("tables", (table) => {
      table.increments("table_id").primary();
      table.integer("reservation_id"); //nullable because null until seated?
      table
        .foreign("reservation_id")
        .references("reservation_id")
        .inTable("reservations")
        .onDelete("cascade");
      table.string("table_name");
      table.integer("capacity");
      table.timestamps(true, true);
    });
  };

exports.down = function (knex) {
    return knex.schema.dropTable("tables");
  };
