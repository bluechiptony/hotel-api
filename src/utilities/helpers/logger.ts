import * as winston from "winston";

let error: any = {
  filename: "./logs/error/filelog-error.log",
  maxsize: 10000000,
  maxFiles: 10,
  timestamp: true,
  colorize: true,
  level: "error",
};
let debug: any = {
  filename: "./logs/debug/filelog-debug.log",
  maxsize: 10000000,
  maxFiles: 10,
  timestamp: true,
  colorize: true,
  level: "debug",
};
let info: any = {
  filename: "./logs/info/filelog-info.log",
  maxsize: 10000000,
  maxFiles: 10,
  timestamp: true,
  colorize: true,
  level: "info",
};

const logger = winston.createLogger({
  // level: "info",
  format: winston.format.combine(winston.format.json(), winston.format.timestamp(), winston.format.prettyPrint()),
  // defaultMeta: { service: "user-service" },
  transports: [new winston.transports.Console(), new winston.transports.File(error), new winston.transports.File(info), new winston.transports.File(debug)],
});

export const terminalLogger = winston.createLogger({
  format: winston.format.combine(winston.format.json(), winston.format.timestamp(), winston.format.prettyPrint()),
  transports: [new winston.transports.Console()],
});

export default logger;
