export default class Sandbox {
  constructor(config) {

    this.config = config;
    this.method = 'GET';
    this.path = '/sandbox';
    this.options = {
      description: 'just a sandbox route',
      notes: 'Does not take user parameters',
      tags: ['api', 'sandbox'],
    };
  }

  async handler(request, h) {

    let sandbox;
    try {
      sandbox = await this.appGet('components', 'sandbox');
    } catch (e) {
      console.log(e);
      throw e;
    }

    sandbox.doStuff();
    return sandbox.stuff;
  }
}
