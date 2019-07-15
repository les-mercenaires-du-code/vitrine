/*
  Apis
  1.0.0
 */
const apis = {
  debug: process.env.NODE_ENV === 'development',
  sandbox: {
    test: 'whatever'
  }
};

export default apis;
