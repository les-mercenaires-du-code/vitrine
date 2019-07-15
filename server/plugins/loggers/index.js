/**
 * Loggers
 * 1.0.0
 */

import winston from 'winston';
import _ from 'lodash';
import moment from 'moment';

export default class Loggers {
  constructor(config = {}) {

    this.config = config;
    this.registry = {};


    this.consoleDefault = {
      timestamp: () => moment().format('DD/MM - hh:mm:ss'),
      colorize: true,
      prettyPrint: true,
      // stringify: true,
      // json: true,
      silent: false,
      humanReadableUnhandledException: true,
    };

    this.fileDefault = {
      maxsize: '10000m',
      maxFiles: 1,
      datePattern: 'yyyy-MM-dd.log',
    };
  }

  async start() {

    try {
      _.forEach(this.config.create || [], (val, key) => {
        const tmp = {
          level: val.level,
          transports: [],
        };

        if (val.console) {
          tmp.transports.unshift(new (winston.transports.Console)(_.merge({
            key,
            level: val.level,
          }, this.consoleDefault, val.console)));
        }

        const logger = new (winston.Logger)(tmp);
        global[key] = global[key] || logger;
        this.registry[key] = logger;
      });

      return this.registry;
    } catch (e) {
      console.log('init loggers failure', e);
      throw e;
    }
  }
}
