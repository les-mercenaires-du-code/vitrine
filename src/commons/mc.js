import _ from 'lodash';
import paper from 'paper';

class Mc {
  constructor() {
    paper.Path.prototype.getPointAtPercent = function (percent) {
	    return this.getLocationAt(percent * this.length).getPoint();
    };

    // this.originWidth = 386;
    // this.originHeight = 253;

    // padding from border/animation ...
    this.padding = 7;

    // C
    this.cPathArr = ["M294.6", "109.5L337.9", "85l-4-6.1c-15.2-24.1-42.5-38.6-73-38.6c-50.4", "0-88.4", "37-88.4", "86.1s38", "86.1", "88.4", "86.1 c30.7", "0", "58.1-14.5", "73.2-38.6l3.8-6.1l-43.5-24.5l-3.6", "6.3c-5.4", "9.5-16.5", "15.1-29.9", "15.1c-23.7", "0-38.4-14.7-38.4-38.3 s14.7-38.3", "38.4-38.3c13.3", "0", "24.3", "5.5", "30.1", "15.2L294.6", "109.5z"];
    this.cPathJoined = this.cPathArr.join(',');

    // M
    this.mPathArr = ["M169.7", "126.5c0-36", "18.8-65.9", "47.6-80.9v-3.7h-43.5l-41.2", "67.4L91.5", "41.9H48.1v169.3h45.3v-82.5l34.8", "57.1h9 l32.7-53.5C169.7", "130.4", "169.7", "128.3", "169.7", "126.5L169.7", "126.5z"];
    this.mPathJoined = this.mPathArr.join(',');

    // /m/.
    this.mbisPathArr = ["M172","147.8v63.4h45.3v-3.7c-3.7-1.9-7.2-4.1-10.6-6.5c-3.5-2.4-6.7-5.1-9.7-8c-4.1-4-7.8-8.3-11.1-12.9 c-2.9-4.2-5.4-8.5-7.5-13.1c-2.7-5.8-4.8-11.9-6.3-18.4C172.1","148.2","172.1","148","172","147.8L172","147.8z"];
    this.mbisPatJoined = this.mbisPathArr.join(',');

  }

  initMc(path, border) {
    this.mPath = new this.paper.Path(this.mPathJoined);
    this.cPath = new this.paper.Path(this.cPathJoined);
    this.mBisPath = new this.paper.Path(this.mbisPatJoined);

    // if (!path && !border) {
    //   this.lettersGroup.addChild(this.mPath);
    //   this.lettersGroup.addChild(this.cPath);
    //   this.lettersGroup.addChild(this.mBisPath);
    // }

    if (path) {
      this.pathChildren = this.createPath();
    }

    if (border) {
      this.borderChildren = this.createBorder();
    }

    return _.union(
      [this.mPath, this.cPath, this.mBisPath],
      _.get(this, 'pathChildren', []),
      _.get(this, 'borderChildren', [])
    );
  }

  createPath() {
    this.mPathBgd = this.mPath.clone();
    this.mPathBgd.fillColor = 'rgba(0,0,0,.15)';
    this.mPathBgd.position.x += this.padding;
    this.mPathBgd.position.y += this.padding;

    this.cPathBgd = this.cPath.clone();
    this.cPathBgd.fillColor = 'rgba(0,0,0,.15)';
    this.cPathBgd.position.x += this.padding;
    this.cPathBgd.position.y += this.padding;

    this.mBisPathBgd = this.mBisPath.clone();
    this.mBisPathBgd.fillColor = 'rgba(0,0,0,.15)';
    this.mBisPathBgd.position.x += this.padding;
    this.mBisPathBgd.position.y += this.padding;

    return [this.mPathBgd, this.cPathBgd, this.mBisPathBgd];

    // this.lettersGroup.addChild(this.mPathBgd);
    // this.lettersGroup.addChild(this.cPathBgd);
    // this.lettersGroup.addChild(this.mBisPathBgd);
  }

  createBorder() {
    this.mPathShaddow = this.mPath.clone();
    this.mPathShaddow.strokeColor = 'rgba(255,255,255,.4)';

    this.cPathShaddow = this.cPath.clone();
    this.cPathShaddow.strokeColor = 'rgba(255,255,255,.4)';

    this.mBisPathShaddow = this.mBisPath.clone();
    this.mBisPathShaddow.strokeColor = 'rgba(255,255,255,.4)';

    return [this.mPathShaddow, this.cPathShaddow, this.mBisPathShaddow];

    // this.lettersGroup.addChild(this.mPathShaddow);
    // this.lettersGroup.addChild(this.cPathShaddow);
    // this.lettersGroup.addChild(this.mBisPathShaddow);
  }
}

export default Mc;
