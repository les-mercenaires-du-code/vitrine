import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';
import _ from 'lodash';
import Hapi from 'hapi';


export default class Api {
  constructor(config, appGet) {

    this.config = config || {};
    this.registry = {};
    this.swagger = {};
    this.appGet = appGet;

    this.verifyConfig();
  }

  verifyConfig() {
    loggerApp.info('TODO add joi validation here');
  }

  async startServer() {

    this.server = new Hapi.Server({
      host: this.config.host,
      port: this.config.port,
    });

    await this.server.start();
  }

  async stopServer() {

    loggerApp.info('[Api.stop] stopping api server...');

    if (!_.isFunction(this.server.stop)) {
      loggerApp.info('[Api.stop] Cannot stop api server');
      return Promise.reject(new Error('[Api.stopServer] this.server.stop is not a function'));
    }

    return new Promise(async(resolve, reject) => {

      this.server.events.on('stop', () => {
        loggerApp.info('[Api.stopServer] Server api stopped');
        resolve('Server front has stopped');
      });

      try {
        await this.server.stop({ timeout: 2000 });
      } catch (e) {
        loggerApp.info('[Api.stopServer] Could not stop server api', e);
        reject(e);
      }
    });
  }

  async start(root = path.join(__dirname, '../../apis')) {

    try {

      await this.startServer();

      const files = await this.ls(root);
      const folders = await this.lsDir(root, files);

      _.each(folders, (main) => {
        const lookUpPath = path.join(root, main, 'index.js');
        try {
          const ApiClass = require(lookUpPath).default;
          const nodeEnv = _.get(this.config, 'nodeEnv', 'production');
          const targetConfig = _.get(this.config, main, {});

          const target = new ApiClass({
            nodeEnv,
            ...targetConfig,
          });
          target.appGet = this.appGet;

          if (!this.hasApi(target, main)) {
            return;
          }

          target.options.cors = this.handleCors(target);

          this.handleDeps(target);
          const handler = (target.handler ? target.handler : target.options.handler).bind(target);

          const route = {
            method: target.method,
            path: target.path,
            options: {
              ...target.options,
              handler,
            },
          };

          // only for debug
          this.registry[main] = target;

          this.updateSwagger(
            target.path,
            target.method,
            target.options ? target.options.description : '',
            target.options ? target.options.notes : '',
            target.options ? target.options.tags : ''
          );

          this.server.route(route);

        } catch (e) {
          loggerApp.info(e);
        }
      });

      await this.debug(root);
      return this.server.info.uri;

    } catch (e) {
      throw e;
    }
  }

  handleCors(target) {

    const targetCors = _.get(target, 'options.cors');
    const globalCors = _.get(this.config, 'cors', {});

    if (targetCors) {

      const globalOrigin = _.get(globalCors, 'origin', []);
      targetCors.origin = _.isArray(targetCors.origin) ?
        _.compact(_.uniq(_.concat(targetCors.origin, globalOrigin))) :
        globalOrigin
      ;
      return _.size(targetCors.origin) ?
        targetCors :
        {}
      ;
    }

    return _.size(globalCors.origin) ?
      globalCors :
      {}
    ;
  }

  handleDeps(target) {

    let deps = _.isArray(target.resolve) ? target.resolve : [target.resolve];
    deps = _.filter(target.resolve, (name) => _.isString(name));
    deps = _.compact(deps);

    _.each(deps, async(dependency) => {
      try {
        const args = _.split(dependency, ':');
        const dep = await this.appGet(...args);
        _.set(target, _.last(args), dep);

      } catch (e) {
        loggerApp.info('error while injecting', e);
      }
    });
  }

  async debug(root) {
    if (!this.config.debug) {
      return;
    }

    const file = path.join(root, '../../debug/', 'apis.json');
    loggerApp.info('[API plugin] debug is enabled, dumping swagger', file);
    const swagger = JSON.stringify(this.swagger, null, 2);
    const ret = await this.write(file, swagger);
    loggerApp.info('[API plugin]', ret);

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

  hasApi(target, main) {
    const flag = _.isString(target.path) &&
      _.isString(target.method) &&
      (_.isFunction(target.handler) || _.isFunction(target.options.handler))
    ;

    // loggerApp.info('does [', main, '] target has api?', flag ? 'yes' : 'no');

    return flag;
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

  updateSwagger(path, method, description, notes, tags) {

    if (!this.swagger[path]) {
      this.swagger[path] = {};
    }

    const key = `${path}.${method.toLowerCase()}`;
    const methodExists = !_.isUndefined(this.swagger[path][method.toLowerCase()]);
    if (this.swagger[path] && methodExists) {
      throw new Error(`[Moulinette] Method ${method} for route ${path} already exists!`);
    }

    _.set(this.swagger, `${key}.description`, description ||
      'todo: add a description field to route definition'
    );

    _.set(this.swagger, `${key}.notes`, notes || 'todo: add notes');
    _.set(this.swagger, `${key}.tags`, tags || 'todo: add notes');
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
