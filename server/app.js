import _ from 'lodash';

import Loggers from './plugins/loggers/';
import Env from './plugins/env/';
import ServerFront from './plugins/front/';
import ServerApi from './plugins/api/';
import Component from './plugins/component/';

export default class App {
  constructor(config) {

    this.config = config || {};
    this.plugins = {};
  }

  // Create and start base plugins
  async start() {

    try {

      // helpers to get plugins
      const get = _.bind(this.get, this);

      // ENV PLUGIN
      const pluginEnv = new Env();
      this.env = await pluginEnv.start();
      this.plugins.env = pluginEnv;

      // LOGGERS PLUGIN
      const pluginLoggers = new Loggers({
        nodeEnv: this.config.nodeEnv,
        ...this.config.loggers,
      });
      await pluginLoggers.start();
      this.plugins.loggers = pluginLoggers;

      // COMPONENTS PLUGIN
      const pluginComponents = new Component({
        nodeEnv: this.config.nodeEnv,
        ...this.config.components,
      }, get);
      await pluginComponents.start();
      this.plugins.components = pluginComponents;

      // SERVER API PLUGIN
      this.plugins.apis = new ServerApi({
        nodeEnv: this.config.nodeEnv,
        ...this.config.apis,
      }, get);
      const apiUrl = await this.plugins.apis.start();

      // SERVER FRONT PLUGIN
      const serverFront = new ServerFront({
          nodeEnv: this.config.nodeEnv,
          ...this.config.front,
      });
      await serverFront.start(async(frontUrl) => {

        loggerApp.warn('Using Env: ', this.env);
        loggerApp.warn('Using Config: ', this.config);

        loggerApp.warn(`Front server running on ${frontUrl}:`);
        loggerApp.warn(`Api server running on ${apiUrl}:`);

        loggerApp.warn('All up!');

      });
      this.plugins.front = serverFront;

    } catch (e) {
      // loggerApp.info('[App.start] start app error', e);
      return Promise.reject(e);
    }
  }

  stop(cb = _.noop) {

    loggerApp.info('[App.stop] Stopping app servers...');
    return Promise.all([
      this.plugins.apis.stopServer(),
      this.plugins.front.stopServer(),
    ])
      .then(() => {
        loggerApp.info('[App.stop] All server stopped');
        cb();
      })
      .catch((err) => {
        loggerApp.info('[App.stop] cannot stop servers', err);
      })
    ;
  }

  /*
  ** get plugin by name
  ** @params name
  ** @params apiName or componentName
  ** if plugin exist will try to invoke plugin.get method with args
   */
  get(name) {

    const plugin = _.get(this.plugins, name);
    if (_.isUndefined(plugin)) {
      throw new Error(`cannot get plugin: ${name}`);
    }

    const args = Array.from(arguments);
    args.shift();

    const fn = _.get(this.plugins, `${name}.get`);
    if (!_.size(args) || !_.isFunction(fn)) {
      return Promise.resolve(plugin);
    }

    return new Promise((resolve, reject) => {

      const result = fn.apply(plugin, args);
      try {
        return result.then(resolve, reject); // promise.
      } catch (e) {
        if (e instanceof TypeError) {
          resolve(result); // resolve naked value.
        } else {
          reject(e); // pass unhandled exception to caller.
        }
      }
    });
  }
}
