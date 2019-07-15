/**
 * Env
 * 1.0.0
 */

import process from 'process';
import pathUtil from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

export default class Env {
  constructor(config) {
    this.config = config || {};

    this.paths = {
      development: this.config.devPath || '../.env_dev',
      production: this.config.prodPath || '../.env_prod',
      test: this.config.testPath || '../.env_test',
    };

    const tab = module.parent.filename.split('/');
    tab.pop();

    this.absolutePath = tab.join('/');
  }

  loadEnv(path) {
    try {
      fs.statSync(path); // eslint-disable-line no-sync
      const env = dotenv.load({ path });

      env.NODE_ENV = process.env.NODE_ENV || 'development';

      return env.parsed;
    } catch (e) {
      throw e;
    }
  }

  start() {

    let path = pathUtil.join(this.absolutePath, this.paths.development);

    const IS_PROD = process.env.NODE_ENV === 'production';
    const IS_TEST = process.env.NODE_ENV === 'test';

    if (!IS_PROD && !IS_TEST) {
      process.env.NODE_ENV = 'development';
    } else {
      path = pathUtil.join(this.absolutePath, this.paths[process.env.NODE_ENV]);
    }


    return this.loadEnv(path);
  }
}
