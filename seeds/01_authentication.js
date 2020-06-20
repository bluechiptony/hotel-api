const bcrypt = require("bcrypt");

const nanoid = require("nanoid");

const dictionary = require("nanoid-dictionary");
const allowableStrings = dictionary.numbers + dictionary.lowercase + dictionary.uppercase;

generateToken = (length) => {
  const custom = nanoid.customAlphabet(allowableStrings, length);

  return custom();
};
generateTokenLength = (length) => {
  return nanoid(length).toUpperCase();
};

exports.seed = function (knex, Promise) {
  // Deletes ALL existing entries

  let authToken = generateToken(256);
  let password = bcrypt.hashSync("password", 1);

  return knex("authentication")
    .del()
    .then(function () {
      // Inserts seed entries
      return knex("authentication").insert([
        {
          auth_id: 1,
          user_code: "USR1092836",
          phone_number: "08028818000",
          email_address: "admin@admin.com",
          wakanda: password,
          account_type: "ADMINISTRATOR",
          activation_token: authToken,
          token_expiry: new Date(),
          active: true,
          created_date: new Date(),
          updated_date: new Date(),
        },
      ]);
    });
};
