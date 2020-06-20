exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries
  return knex("users")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("users").insert([
        {
          user_id: 1,
          user_code: "USR1092836",
          first_name: "Admin",
          last_name: "Administrator",
          account_type: "SUPER_ADMINISTRATOR",
          email_address: "admin@admin.com",
          phone_number: "08028818000",
          created_date: new Date(),
          updated_date: new Date(),
        },
      ]);
    });
};
