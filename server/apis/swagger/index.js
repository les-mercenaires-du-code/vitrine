import _ from 'lodash';

export default class Swagger {
  constructor(config) {

    this.config = config;
    this.method = 'GET';
    this.path = '/swagger';
    this.options = {};

    this.resolve = [
      'apis',
      'components:sandbox'
    ];

    this.options.description = 'returns this';
  }

  async handler(request, h) {

    const swagger = _.get(this.apis, 'swagger', {
      error: 'Swagger is not accesible for now'
    });

    return swagger;
  }
}
