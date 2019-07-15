import path from 'path';

import loggers from './loggers';
import front from './front';
import apis from './apis';
import components from './components';

const config = {
  appName: 'stack',
  nodeEnv: process.env.NODE_ENV,
  rootDir: path.join(__dirname, '../../'),
  loggers,
  front,
  apis,
  components,
};

export default config;
