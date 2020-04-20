const winston = require("winston");

const logger = winston.createLogger({});
logger.add(
  new winston.transports.Console({
    level: "verbose",
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.prettyPrint(),
      winston.format.simple()
    ),
  })
);

module.exports = logger;
