const winston = require('winston');

const transports = {
  console: new winston.transports.Console({
    name: 'error-console',
    level: 'error',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    exitOnError: true,
  }),
  file: new winston.transports.File({
    name: 'debug-file',
    filename: 'log.log',
    level: 'debug',
    handleExceptions: true,
    humanReadableUnhandledException: true,
    exitOnError: true,
    json: false,
    maxsize: 104857600,
    maxFiles: 5,
  })
};

module.exports = winston.createLogger({
    transports: [
      transports.console,
      transports.file
    ]
});

