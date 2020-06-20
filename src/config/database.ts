import * as dotenv from "dotenv";
import * as knex from "knex";
import { Config } from "knex";

dotenv.config();
const databaseConfig: Config = {
  client: process.env.KNEX_DATABASE_CLIENT,
  connection: {
    host: process.env.DATABASE_HOST,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
  },
};

export class Connection {
  public knex(): knex {
    return knex.default(databaseConfig);
  }
}
