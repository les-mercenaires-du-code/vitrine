export default class Sandbox {
  constructor(config) {

    this.config = config || {};
    this.stuff = 'just testing component retrieving in apis';
  }

  async doStuff() {
    this.stuff = 're written stuff';
    let tmp;
    try {
      tmp = await this.appGet('queues');
    } catch (e) {
      console.log(e);
      throw e;
    }

    console.log('tmp', tmp);
  }
}
