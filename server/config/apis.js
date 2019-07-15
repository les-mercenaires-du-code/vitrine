/*
  Apis
  1.0.0
 */
const apis = {

  // global api config
  debug: process.env.NODE_ENV === 'development',
  host: 'localhost',
  port: 3000,
  cors: {
    // global origins will be concat with specific api origin
    origin: [
      'http://localhost:3001',
    ],
  },

  // specific api config
  sandbox: {
    test: 'fake api sandbox config',
  },
  swagger: {
    test: 'fake api swagger config',
  },
  upload: {

  }
};

export default apis;
