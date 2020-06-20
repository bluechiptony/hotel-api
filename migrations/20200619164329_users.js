let tableName = "users";
exports.up = function (knex) {
  return knex.schema.createTable(tableName, (table) => {
    table.increments("user_id").primary().notNullable();

    table.string("user_code", 15).notNullable();
    table.string("first_name", 30).notNullable();
    table.string("last_name", 30).notNullable();
    table.string("email_address", 30).notNullable();
    table.string("phone_number", 20).nullable();
    table.string("account_type", 20).notNullable();

    table.date("created_date").notNullable(new Date());
    table.date("updated_date").notNullable(new Date());
    table.text("created_by").nullable();
    table.text("updated_by").nullable();

    table.index("user_code", "user_user_code");
    table.index("first_name", "user_first_name");
    table.index("last_name", "user_last_name");
    table.index("phone_number", "user_phone_number");
    table.index("email_address", "user_email_address");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable(tableName);
};
