import 'babel-polyfill';

import config from './config/';
import App from './app';


const app = new App(config);
setImmediate(() => app.start());

process.once('SIGUSR2', async() => {
  console.log('=> Files have changed, stoping app, killing process and restarting');
  try {
    await app.stop();
    process.kill(process.pid, 'SIGUSR2');
  } catch (e) {
    console.log('SIGUSR2 event app stop error', e);
  }
});
