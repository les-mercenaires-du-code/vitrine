import paper from 'paper';

class Mc {
  constructor() {
    // C
    this.cPathArr = ["M201.2", "56.4l35.4-20l-3.2-5C221", "11.8", "198.7", "0", "173.8", "0c-41.2", "0-72.2", "30.2-72.2", "70.3c0", "40.1", "31", "70.3", "72.2", "70.3c25.1", "0", "47.4-11.8", "59.7-31.5l3.1-5l-35.5-20l-2.9", "5.1c-4.4", "7.7-13.5", "12.3-24.4", "12.3c-19.3", "0-31.3-12-31.3-31.2s12-31.2", "31.3-31.2c10.9", "0", "19.8", "4.5", "24.5", "12.4L201.2", "56.4z"];
    this.cPathJoined = this.cPathArr.join(',');
    // M
    this.mPathArr = ["M99.3", "70.3c0-29.4", "15.4-53.8", "38.9-66v-3h-35.5l-33.6", "55l-33.6-55H0v138.2h37V72.1l28.4", "46.6h7.3L99.4", "75C99.3", "73.4", "99.3", "71.8", "99.3", "70.3z"];
    this.mPathJoined = this.mPathArr.join(',');
    // /m/.
    this.mbisPathArr = ["M101.2", "87.6v51.7h37v-3C119.4", "126.6", "105.9", "109.1", "101.2", "87.6z"];
    this.mbisPatJoined = this.mbisPathArr.join(',');
  }

  initMc() {
    this.lettersGroup = new paper.Group();
    this.createFilledLetters();
    this.createShaddow();
  }

  createFilledLetters() {
    this.mPath = new paper.Path(this.mPathJoined);
    this.cPath = new paper.Path(this.cPathJoined);
    this.mBisPath = new paper.Path(this.mbisPatJoined);

    this.lettersGroup.addChild(this.mPath);
    this.lettersGroup.addChild(this.cPath);
    this.lettersGroup.addChild(this.mBisPath);
  }

  createShaddow() {
    this.mPathShaddow = this.mPath.clone();
    this.mPathShaddow.fillColor = 'rgba(0,0,0,.15)';
    this.mPathShaddow.strokeColor = 'rgba(255,255,255,.4)';
    this.mPathShaddow.position.x += 3;
    this.mPathShaddow.position.y += 3;

    this.cPathShaddow = this.cPath.clone();
    this.cPathShaddow.fillColor = 'rgba(0,0,0,.15)';
    this.cPathShaddow.strokeColor = 'rgba(255,255,255,.4)';
    this.cPathShaddow.position.x += 3;
    this.cPathShaddow.position.y += 3;

    this.mBisPathShaddow = this.mBisPath.clone();
    this.mBisPathShaddow.fillColor = 'rgba(0,0,0,.15)';
    this.mBisPathShaddow.strokeColor = 'rgba(255,255,255,.4)';
    this.mBisPathShaddow.position.x += 3;
    this.mBisPathShaddow.position.y += 3;

    this.lettersGroup.addChild(this.mPathShaddow);
    this.lettersGroup.addChild(this.cPathShaddow);
    this.lettersGroup.addChild(this.mBisPathShaddow);
  }
}

export default Mc;
