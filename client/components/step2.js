import {Mc, Util} from '../commons/index.js';
import paper from 'paper';

class Step0 extends Mc {
  constructor($scene) {
    super($scene);
    this.canvas = document.getElementById('step2');
    this.ctx = this.canvas.getContext('2d');
    this.color = ['#42c9be', '#d6643b', '#63074f'];
    this.$scene = $scene;
    this.paper = paper.setup(this.canvas);

    this.isRunning = true;
    this.direction = [[0,2],[0,3]];

    this.maxLines = 10;
    this.lineArr = [];

    window.addEventListener('step2', (e) => {
      this.isRunning ? this.stop() : this.start();
    }, false);

    this.canvas.onclick = (e) => {
      this.isRunning ? this.stop() : this.start();
    };
  }

  init() {
    // draw MC
    this.initMc()

    this.lineGroup = new this.paper.Group();

    for (let i = 0; i < this.maxLines; i++) {
      this.createLine(i);
    }

    // combine both
    this.mGroup = new this.paper.Group([this.mPath, this.lineGroup]);
    this.mGroup.clipped = true;

    this.mBisGroup = new this.paper.Group([this.mBisPath, this.lineGroup.clone()]);
    this.mBisGroup.clipped = true;

    this.cGroup = new this.paper.Group([this.cPath, this.lineGroup.clone()]);
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
    this.paper.view.onFrame = (time) => {};
  }

  createLine(n) {
    const path1 = new paper.Path();
    const amplitude = this.$scene.wH / 3;
    const frequency = .035;
    const phi = 0;
    const randomWidth = Util.getRandomInt(20, 50);
    const randomTranslate = Util.getRandomInt(-n * 2,n * 2);

    path1.strokeColor = this.color[Util.getRandomInt(0,3)]
    path1.strokeWidth = randomWidth;
    path1.opacity = .6;

    for (let x = 0; x < this.$scene.wW; x++) {
      let y = Math.sin(x * frequency + phi) * amplitude / 2 + amplitude / 2;
      path1.add(new paper.Point(x, y));
    }

    path1.translate(new paper.Point(randomTranslate - 50, randomTranslate + 30));
    path1.rotate(-15);

    // WARN necessary after translate
    const randomAmp = Util.getRandomInt(30, 50);
    const randomPitch = Util.getRandomInt(1,1.2);
    path1.data = {
      randomAmp,
      randomPitch,
      x: 0,
      maxAmp: randomAmp,
      minAmp: randomAmp * - 1,
      direction: Util.getRandomInt(0,1) === 1,
    }
    // console.log(path1);
    this.lineGroup.addChild(path1);
    this.lineArr.push(path1);
  }


  onFrame(time) {
    if (!this.isRunning) return;

    for (let i = 0; i < this.maxLines; i++) {
      this.anim(this.lineArr[i]);
    }

    this.cGroup.children[1] = this.lineGroup;
    this.mBisGroup.children[1] = this.lineGroup;
  }

  reverse(line) {
    line.data.direction = !line.data.direction;
    line.data.x = 0;
  }

  anim(line, t) {
    const dir = line.data.direction ? line.data.randomPitch : -line.data.randomPitch;
    const posX = line.data.x;
    const position = line.position.x;
    const minAmp = line.data.minAmp;
    const maxAmp = line.data.maxAmp;

    line.translate(new paper.Point(dir));
    line.data.x += line.data.randomPitch;

    if (minAmp > posX || posX > maxAmp) {
      this.reverse(line);
    }
  }
}

export default Step0;
