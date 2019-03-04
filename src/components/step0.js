import {Mc, Util} from '../commons/index.js';
import paper from 'paper';

class Step0 extends Mc {
  constructor($scene) {
    super($scene);
    this.canvas = document.getElementById('step0');
    this.ctx = this.canvas.getContext('2d');
    this.color = ['#42c9be', '#d6643b', '#63074f'];
    this.$scene = $scene;
    this.paper = paper.setup(this.canvas);
    this.isRunning = false;

    this.triLength = 12;
    this.triangleGroupArr = [];

    window.addEventListener('step0', (e) => {
      this.isRunning ? this.stop() : this.start();
    }, false);

    this.canvas.onclick = (e) => {
      this.isRunning ? this.stop() : this.start();
    };
  }

  init() {
    // draw MC
    this.initMc()

    // draw triangles
    this.triangleGroup = new this.paper.Group();
    for (let i=0; i<this.triLength;i++){
      var tri = this.createTri();
      tri.scale(.8);
    }

    // combine both
    this.mGroup = new this.paper.Group([this.mPath, this.triangleGroup]);
    this.mGroup.clipped = true;

    this.mBisGroup = new this.paper.Group([this.mBisPath, this.triangleGroup.clone()]);
    this.mBisGroup.clipped = true;

    this.cGroup = new this.paper.Group([this.cPath, this.triangleGroup.clone()]);
    this.cGroup.clipped = true;
  }

  start() {
    if (!this.mGroup) this.init();

    this.isRunning = true;
    // animation
    this.paper.view.onFrame = (time) => this.onFrame(time);
  }

  stop() {
    this.isRunning = false;
    // animation
    // this.paper.clear();
    this.paper.view.onFrame = (time) => {};
  }

  createTri(){
    let tri = new this.paper.Path();
    tri.entity = 'triangle';
    tri.add(new paper.Point(Util.getRandomInt(0,90), Util.getRandomInt(180,190) ));
    tri.add(new paper.Point(Util.getRandomInt(80,140), Util.getRandomInt(40,60) ));
    tri.add(new paper.Point(Util.getRandomInt(200,320), Util.getRandomInt(150,190) ));
    tri.position = new paper.Point(this.$scene.mdlW / 2, this.$scene.mdlH / 2).multiply(this.paper.Point.random());
    tri.fillColor = this.color[Util.getRandomInt(0,3)];
    tri.opacity = .6;
    tri.data = {
      deg: Util.getRandomInt(-2, 2),
      x: Util.getRandomInt(-3, 5),
      y: Util.getRandomInt(-4, 4),
    };
    tri.closed = true;
    this.triangleGroup.addChild(tri);
    this.triangleGroupArr.push(tri);
    return tri;
  }


  animTri(tri){
    const pos = tri.position,
      posX = pos.x,
      posY = pos.y,
      triData = tri.data,
      dataX = triData.x,
      dataY = triData.y,
      datX = dataX > 0 ? true : false,
      datY = dataY > 0 ? true : false;

    tri.rotate(tri.data.deg);
    tri.position.x += (dataX);
    tri.position.y += (dataY);

    switch(true){
      case !datX && posX < 0 :
        tri.data.x = dataX * -1;
      case datX  && posX > this.$scene.mdlW :
        tri.data.x = dataX * -1;
      case !datY && posY < 0 :
        tri.data.y = dataY * -1;
      case datY && posY > this.$scene.mdlH :
        tri.data.y = dataY * -1;
      default: break;
    }
  }

  onFrame(time) {
    if (!this.isRunning) return;
    for (let i = 0; i < this.triLength; i++) {
      this.animTri(this.triangleGroupArr[i]);
    }
    this.cGroup.children[1] = this.triangleGroup;
    this.mBisGroup.children[1] = this.triangleGroup;
  }
}

export default Step0;
