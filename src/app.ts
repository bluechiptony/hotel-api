import express, { Application } from "express";
import bodyParser, { urlencoded } from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { terminalLogger } from "./utilities/helpers/logger";
dotenv.config();
const applicationName = process.env.APP_NAME;
const port = process.env.PORT;
const b54: Application = express();

b54.use(bodyParser.urlencoded({ extended: false }));
b54.use(bodyParser.json());
b54.use(express.json());
b54.use(cors());

import AuthenticationRoutes from "./routes/authentication";
import UserRoutes from "./routes/user";

b54.use("/users", UserRoutes);
b54.use("/authentication", AuthenticationRoutes);

b54.listen(port, async () => {
  terminalLogger.info(`${applicationName} running on port: ${port}`);
});
