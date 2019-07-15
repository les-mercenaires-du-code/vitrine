/**
 * Servers
 * 1.0.0
 */

import _ from 'lodash';
import Inert from 'inert';
import Promise from 'bluebird';
import Hapi from 'hapi';
import EventEmitter from 'events';
import path from 'path';


export default class Servers extends EventEmitter {
  constructor(config = {}) {
    super();

    this.config = config;

    this.assets = [
      'fonts',
      'images',
      'styles',
      'build',
      'favicon.ico',
    ];
  }

  async startServer() {

    this.server = new Hapi.Server({
      host: _.get(this.config, 'host'),
      port: _.get(this.config, 'port'),
    });

    if (this.config.nodeEnv === 'development') {

      const hapiWepackPlugin = this.getMiddleware();
      await this.server.register(hapiWepackPlugin);

      this.on('bundleValid', () => this.bundleValid());
      hapiWepackPlugin.options.compiler.hooks.done.tap('bundleValid', () => {
        this.emit('bundleValid');
      });
    }

    await this.server.register(Inert);

    const directoriesPath = path.join(__dirname, '../../../public/');
    this.server.route({
      method: 'GET',
      path: '/{param*}',
      handler: {
        directory: {
          path: directoriesPath,
          redirectToSlash: true,
          lookupCompressed: this.config.nodeEnv === 'production',
        },
      },
    });

    this.server.ext('onPreResponse', (request, reply) => {
      const splitPath = _.split(request.path, '/');
      const tabs = _.compact(splitPath);
      const root = _.first(tabs);

      if (request.path === '/' || _.includes(this.assets, root)) {
        return reply.continue;
      }

      let params = _.get(request, 'params.param');
      params = params ? `?redirect=${params}` : '';

      return reply.redirect(`/${params}`);
    });

    await this.server.start();
  }

  async stopServer() {

    if (!_.isFunction(this.server.stop)) {
      loggerApp.info('[Front.stopServer] Cannot stop front server');
      return Promise.resolve();
    }

    return new Promise(async(resolve, reject) => {

      this.server.events.on('stop', () => {
        loggerApp.info('[Front.stopServer] Server front stopped');
        resolve('Server front has stopped');
      });

      try {
        await this.server.stop({ timeout: 2000 });
      } catch (e) {
        loggerApp.info('[Front.stopServer] Could not stop server front', e);
        reject(e);
      }
    });
  }

  /*
    Get hapi webpack hot reload
    Only if NODE_ENV=development
   */
  getMiddleware() {

    const webpack = require('webpack');
    const WebpackPlugin = require('hapi-webpack-plugin');
    const webpackConfig = require('../../../client/config/webpack-config-dev.js');

    // compile front end
    const compiler = webpack(webpackConfig);

    // webpack-dev-middleware config
    const assets = {
      noInfo: true,
      stats: {
        // copied from `'minimal'`
        all: false,
        modules: true,
        maxModules: 0,
        errors: true,
        warnings: false,
        // our additional options
        moduleTrace: true,
        errorDetails: true
      },
      publicPath: webpackConfig.output.publicPath,
      serverSideRender: false,
    };

    // webpack-hot-middleware config
    const hot = {};

    const hapiWepackPlugin = {
      // Serve hot-reloading bundle to client
      plugin: WebpackPlugin,
      options: {
        compiler,
        assets,
        hot,
      },
    };

    return hapiWepackPlugin;
  }

  async start(cb = () => {}) {

    this.cb = cb;
    try {
      await this.startServer();
      if (this.config.nodeEnv === 'production') {
        this.bundleValid();
      }

    } catch (e) {
      loggerApp.info('init error', e);
      throw e;
    }
  }

  bundleValid() {
    this.cb(this.server.info.uri);
  }

}
