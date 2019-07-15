import _ from 'lodash';
import fs from 'fs';
import path from 'path';


export default class Upload {
  constructor(config) {

    this.config = config;
    this.method = 'POST';
    this.path = '/upload';
    this.options = {
      description: 'returns this',
      payload: {
        maxBytes: 52428800,
        allow: 'multipart/form-data',
        output: 'stream',
        parse: 'true',
      },
    };

    this.uploadDir = path.join(__dirname, '../../../uploads/');

    // not necessary but usefull for logging purposes
    _.bindAll(this, [
      'writeStreams',
    ]);
  }

  async handler(request) {

    const data = request.payload;
    const handle = _.isArray(data.files) ? data.files : [data.files];
    const promises = this.writeStreams(handle);

    return Promise.all(promises)
      .then((res) => {
        return res;
      })
     ;
  }

  writeStreams(handle) {

    return _.map(handle, (f) => {

      return new Promise((resolve, reject) => {

        const name = f.hapi.filename;
        const targetPath = path.join(this.uploadDir, name);
        const file = fs.createWriteStream(targetPath);

        file.on('error', (err) => console.error(err));

        f.pipe(file);

        f.on('end', (err) => {
          if (err) {
            console.log(err);
            return reject(err);
          }

          resolve({
            targetPath,
            name,
          });
        });
      });
    });
  }
}
