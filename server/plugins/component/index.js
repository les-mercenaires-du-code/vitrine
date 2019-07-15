import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';

import _ from 'lodash';

export default class Components {
  constructor(config = {}, appGet = _.noop) {

    this.config = config;
    this.appGet = appGet;

    this.registry = {};
  }

  get(component) {

    if (!_.isString(component)) {
      throw new Error('component is required to be a string');
    }

    const target = this.registry[component];
    if (_.isUndefined(target)) {
      throw new Error('target is Undefined');
    }

    return target;
  }

  async start(root = path.join(__dirname, '../../components')) {

    try {

      const files = await this.ls(root);
      const folders = await this.lsDir(root, files);

      _.each(folders, (main) => {

        const lookUpPath = path.join(root, main, 'index.js');
        try {

          const TargetClass = require(lookUpPath).default;
          const nodeEnv = _.get(this.config, 'nodeEnv', 'production');
          const targetConfig = _.get(this.config, main, {});

          const target = new TargetClass({
            nodeEnv,
            ...targetConfig,
          });
          target.appGet = this.appGet;
          this.registry[main] = target;
        } catch (e) {
          console.log(`[Components] init component ${main} error`, e);
          throw e;
        }
      });

      await this.debug(root);

      return this.registry;
    } catch (e) {
      console.log('[Components] init error', e);
      throw e;
    }
  }

  async debug(root) {

    if (!this.config.debug) {
      return;
    }

    const file = path.join(root, '../../debug/', 'components.json');
    console.log('[COMPONENT plugin] debug is enabled, dumping components', file);
    const swagger = JSON.stringify(this.registry, null, 2);
    try {
      const res = await this.write(file, swagger);
      console.log('[COMPONENT plugin]', res);
     } catch (e) {
      console.log('debug component error', e);
      throw e;
    }
  }


  write(file, data) {
    return new Promise((resolve, reject) => {
      fs.writeFile(file, data, 'utf8', (err) => {
        if (err) {
          reject(err);
        }
        resolve('swagger written');
      });
    });
  }
  // filters files and returns folders, given filenames and rootPath
  async lsDir(rootPath, filenames) {

    const folders = await Promise.map(filenames, async(filename) => {

      const check = path.join(rootPath, filename);
      const stat = await fs.lstatSync(check);

      const isDir = stat.isDirectory();
      return isDir && filename;
    }).tapCatch((err) => {

      console.error(err);
    });

    return _.compact(folders);
  }

  // returns filenames from ...
  ls(from) {
    return new Promise((resolve, reject) => {

      fs.readdir(from, (err, files) => {
        if (err) {
          return reject(err);
        }

        return resolve(files);
      });
    })
      .catch((err) => {
        throw err;
      })
    ;
  }
}
