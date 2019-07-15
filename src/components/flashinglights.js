import {Mc, Util} from '../commons/index.js';
import paper from 'paper';
import _ from 'lodash';
import $ from 'jquery';

class Flashinglights extends Mc {
  constructor($scene) {
    super();

    this.$scene = $scene;
    this.canvas = document.getElementById('intro');
    this.ctx = this.canvas.getContext('2d');
    this.paper = new paper.PaperScope().setup(this.canvas);
    this.layer = new this.paper.Layer();
    this.paper.name = 'flashinglights';

    this.util = Util;

    this.duration = 4;
    this.maxScaling = 15; // = 1.015
    this.animationSpeed = .0008;
    this.callbackEvent = new Event('flashinglightsEnd');
  }

  init() {
    const children = this.initMc(0, 0);
    this.layer.addChildren(children);
    this.layer.strokeColor = 'rgba(255,255,255,.4)';

    // SET NECESSARY DATA
    _.each(this.layer.children, (child, i) => {
      this.layer.children[i].actualScaling = 1;
      this.layer.children[i].maxScaling = this.maxScaling;
    });

    this.start();
  }

  start() {
    const now = Date.now();
    this.animationEndTime = now + this.duration;
    this.paper.view.onFrame = (time) => this.onFrame(time);
  }

  stop() {
    this.paper.view.onFrame = (time) => {};
    this.layer.children = [];
  }

  onFrame(time) {
    const now = Date.now();
    const percent = (this.duration - (this.animationEndTime - now)) / this.duration;
    const scaling = this.maxScaling * percent / 100000; // echelle de scale 0 à 1 pour un rapport en %, division par 100 en plus
    const luminosity = ((100 - percent) / 100);

    if (percent > 99) return this.stop();

    _.each(this.layer.children, (child, i) => {
      child.scale(1 + scaling);
      child.opacity = luminosity;
    });
  }
}

export default Flashinglights;
