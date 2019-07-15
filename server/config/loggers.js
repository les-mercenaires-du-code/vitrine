/*
  Loggers
  1.0.0
 */
const loggers = {
  logDir: 'logs',
  create: {
    loggerApp: {
      level: 'verbose',
      console: true,
      process: true,
    },
    loggerAuth: {
      level: 'verbose',
      console: true,
    },
  }
};

export default loggers;
