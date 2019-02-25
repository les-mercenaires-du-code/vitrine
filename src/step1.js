import paper from 'paper';
import Util from './util.js';
import Mc from './mc.js';

class Step1 extends Mc {
  constructor($scene) {
    super($scene);
    this.canvas = document.getElementById('step1'),
    this.ctx = this.canvas.getContext('2d'),
    this.paper = paper.setup(this.canvas);
    this.color = ['#42c9be', '#d6643b', '#63074f'];
    this.$scene = $scene;
    this.isRunning = true;

    this.maxAnim = 300;
    this.every500ms = 50;
    this.oldTrigger = -1;
    this.maxAnimLimit = Math.round(this.maxAnim * 100 / 100);
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
      columnPadding: 3 * 3,
      linePadding: 3 * 3,
    };

    window.addEventListener('step1', (e) => {
      this.isRunning ? this.stop() : this.start();
    }, false);

    this.canvas.onclick = (e) => {
      this.isRunning ? this.stop() : this.start();
    };
  }

  init() {
    // draw MC
    this.initMc();

    this.initDottedLine();
    this.initRandomAnim();

    // combine both
    this.mGroup = new this.paper.Group([this.mPath, this.dottedGroup, this.animatedGroup]);
    this.mGroup.clipped = true;

    this.mBisGroup = new this.paper.Group([this.mBisPath, this.dottedGroup.clone(), this.animatedGroup.clone()]);
    this.mBisGroup.clipped = true;

    this.cGroup = new this.paper.Group([this.cPath, this.dottedGroup.clone(), this.animatedGroup.clone()]);
    this.cGroup.clipped = true;
  }

  start() {
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

  resize() {
    this.paper.project.clear();
    this.init();
    if (this.isRunning) {
      this.start();
    }
  }

  initDottedLine() {
    // necessary
    this.necessaryColumns = Math.trunc(this.$scene.wW / this.sizeDots.columnPadding);
    this.necessaryRows = Math.trunc(this.$scene.wH / this.sizeDots.linePadding);
    this.necessaryDots = Math.trunc(this.necessaryRows * this.necessaryColumns - this.maxAnim);

    // COVERAGE
    this.itemNbrToDisplay = Math.trunc((this.necessaryDots * this.dotsCoverage / 100));
    this.itemNbrToDisplayByColumns = this.itemNbrToDisplay / this.necessaryColumns;

    //create GRID
    const sizeDots = this.sizeDots;
    const spaceBetweenEachPointsOnX = sizeDots.w + sizeDots.columnPadding;
    const spaceBetweenEachPointsOnY = sizeDots.h + sizeDots.linePadding;

    this.Xmultiple = this.getMultiple(this.$scene.wW, spaceBetweenEachPointsOnX);
    this.Ymultiple = this.getMultiple(this.$scene.wH, spaceBetweenEachPointsOnY);
    for (let i = 0; i <= this.necessaryRows ; i++) {
      this.createDottedLine(i * this.sizeDots.linePadding);
    }
    // STATS
    // console.log(this.necessaryDots, 'necessaryDots');
    // console.log(this.itemNbrToDisplay, 'coverage of dots ');
    // console.log(this.necessaryRows, 'necessaryRows');
    // console.log(this.itemToDisplay, 'itemToDisplay');
    // console.log(this.dotsArr);
  }

  create(pointTopLeft, color) {
    const left = pointTopLeft.x;
    const top = pointTopLeft.y
    let dot = new this.paper.Path();
    dot.entity = 'dot';

    dot.fillColor = this.color[Util.getRandomInt(0,3)];
    dot.add(pointTopLeft); // topright
    dot.add(new this.paper.Point(left + this.sizeDots.w, top) ); // bottomright
    dot.add(new this.paper.Point(left + this.sizeDots.w, top + this.sizeDots.h) ); // bottomright
    dot.add(new this.paper.Point(left, top + this.sizeDots.h) ); // bottomleft
    dot.closed = true;

    this.dottedGroup.addChild(dot);
    return dot;
  }

  createDottedLine(top) {
    for (let i = 0; i <= this.itemNbrToDisplayByColumns; i++) {
      let randomDot = this.randomDot('white');
    }
  } //end createLine

  initRandomAnim() {
    let itemsToCreate = this.maxAnimLimit;
    itemsToCreate = this.getRandomInt(5, itemsToCreate);
    // pick randomly
    for (let i = 0; i < itemsToCreate; i++) {
      let animatedDot = this.randomDot('orange');
      animatedDot.fillColor = this.color[Util.getRandomInt(0,3)];
      animatedDot.direction = this.direction[this.getRandomInt(0,3)];
      animatedDot.startAnim = 0;
      animatedDot.endAnim = 0;
      this.animatedGroup.addChild(animatedDot);
    }
  }

  onFrame(time) {
    if (!this.isRunning) return;
    this.every500ms = Math.round(time.time * 2);
    // debugger
    let deletedItem = 0;

    for (let i = 0; i < this.animatedGroup.children.length; i++) {
      const base = this.animatedGroup.children[i];
      // const target = base.clone(false, true);
      // target.direction = base.direction;
      // target.position = base.position;
      // target.startAnim = target.startAnim || time.time;
      // target.endAnim = target.endAnim || time.time + 0.5;
      // target.fillColor = 'yellow';

      base.startAnim = base.startAnim || time.time;
      base.endAnim = base.endAnim || time.time + 0.5;

      // if (time.time < target.endAnim) {
      //   target.position.x += (target.direction[0]);
      //   target.position.y += (target.direction[1]);
      // } else {
      //   // target.remove();
      // }

      if (time.time < base.endAnim) {
        base.position.x += (base.direction[0]);
        base.position.y += (base.direction[1]);
        // base.clone();
      } else {
        base.remove();
      }

    }

    this.cGroup.children[1] = this.animatedGroup;
    this.mBisGroup.children[1] = this.animatedGroup;

    if (this.every500ms === this.oldTrigger) {
      return;
    } else {
      this.oldTrigger = this.every500ms;
      // if (this.animatedGroup.children.length < this.maxAnimLimit) {
        this.initRandomAnim();
      // }
    }
  }


  randomDot(color) {
    var maxPoint = new this.paper.Point(this.$scene.wW, this.$scene.wH);
    var randomPoint = this.paper.Point.random();
    var point = maxPoint.multiply(randomPoint);
    // realign
    const X = Math.trunc(point.x);
    point.x = this.closest(X, this.Xmultiple);
    const Y = Math.trunc(point.y);
    point.y = this.closest(Y, this.Ymultiple);
    return this.create(point, color);
  }

  getRandomInt(min, max) {
    let result = Math.round(Math.random() * (max - min) + min);

    while(result == 0){
      result = Math.round(Math.random() * (max - min) + min);
    }
    return result;
  }

  getMultiple(limit, divisor) {
    const result = [];
    const truncatedCount = limit / divisor;
    const highestMultiple = truncatedCount * divisor;

    for (let multiple = highestMultiple; multiple > 0; multiple -= divisor) {
        result.push(Math.round(multiple));
    }
    return result;
  }

  closest(num, arr) {
    let curr = arr[0];
    let diff = Math.abs(num - curr);

    for (let val = 0; val < arr.length; val++) {

      let newdiff = Math.abs(num - arr[val]);

      if (newdiff < diff) {
        diff = newdiff;
        curr = arr[val];
      }
    }
    return curr;
  }
}

export default Step1;
