import paper from 'paper';
import Util from './util.js';
import Mc from './mc.js';

class Step1 extends Mc {
  constructor($scene) {
    super($scene);
    this.canvas = document.getElementById('step1');
    this.ctx = this.canvas.getContext('2d');
    this.paper = paper.setup(this.canvas);
    this.color = ['#42c9be', '#d6643b', '#63074f'];
    this.$scene = $scene;
    this.isRunning = true;

    this.maxAnim = 50;
    this.every500ms = 0;
    this.oldTrigger = -1;
    this.maxAnimLimit = Math.round(this.maxAnim * 40 / 100);
    this.colors = ['yellow', 'darkCyan', 'yellow', 'orange', 'royalblue'];
    this.direction = [[4,0],[-4,0],[0,4],[0,-4]];


    this.dottedGroup = new paper.Group({
      children : [],
      position: this.paper.view.center,
    });

    this.animatedGroup = new paper.Group({
      children : [],
      position: this.paper.view.center,
    });

    this.dotsCoverage = 60;
    this.sizeDots = {
      w: 4,
      h: 4,
      columnPadding: 3 * 6,
      linePadding: 3 * 6,
    };

    window.addEventListener('step1', (e) => {
      this.isRunning ? this.stop() : this.start();
    }, false);
  }

  init() {
    // draw MC
    // this.initMc();
    this.mGroup = [];
    console.log('-init');

    this.drawGrid();
    this.drawDots();

    // this.dot();
    // combine both
    // this.mGroup = new this.paper.Group([this.mPath, this.dottedGroup, this.animatedGroup]);
    // this.mGroup.clipped = true;
    //
    // this.mBisGroup = new this.paper.Group([this.mBisPath, this.dottedGroup.clone(), this.animatedGroup.clone()]);
    // this.mBisGroup.clipped = true;
    //
    // this.cGroup = new this.paper.Group([this.cPath, this.dottedGroup.clone(), this.animatedGroup.clone()]);
    // this.cGroup.clipped = true;
  }

  start() {
    // console.log('step1 start');
    if (!this.mGroup) this.init();
    this.isRunning = true;
    // animation
    this.paper.view.onFrame = (time) => this.onFrame(time);
  }

  stop() {
    // console.log('step1 stop');
    this.isRunning = false;
    // animation
    this.paper.view.onFrame = (time) => {};
  }

  drawGrid(){
    var cellW = 10,
        cellH = 10;

    // vertical lines
    for (var x = 0; x <= this.$scene.vw; x += cellW) {
      console.log("-");
        this.ctx.moveTo(x, 0); // x, y
        this.ctx.lineTo(x, this.$scne.vh);
    }

    // horizontal lines
    for (var y = 0; y <= this.$scene.vh; y += cellH) {
      console.log("-");
        this.ctx.moveTo(0, y); // x, y
        this.ctx.lineTo(this.$scene.vw, y);
    }

    this.ctx.strokeStyle = "#cccccc";
    this.ctx.stroke();
  }

  drawDots() {
    var r = 2,
        cw = 30,
        ch = 30;
        console.log('drawDots');
        console.log(this.$scene);
    for (var x = 20; x < this.$scene.wW; x+=cw) {
      for (var y = 20; y < this.$scene.wH; y+=ch) {
          // let tt = new paper.Rectangle(x-r/2,y-r/2,r,r);
          let rectangle = new paper.Rectangle({
            point: [x-r/2,y-r/2],
            size: [r,r],
          });
          rectangle.strokeColor = 'black';
          // tt.fillColor = '#000000';
          // console.log("-");
//           var rectangle = new paper.Rectangle(new paper.Point(20, 20), new paper.Size(60, 60));
// var path = new paper.Path.Rectangle(rectangle);
        }
    }
  }

  onFrame(time) {}
}

export default Step1;
