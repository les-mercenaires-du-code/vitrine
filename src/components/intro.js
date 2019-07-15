import {Mc, Util} from '../commons/index.js';
import paper from 'paper';
import _ from 'lodash';
import $ from 'jquery';

class Intro extends Mc {
  constructor($scene) {
    super();

    this.$scene = $scene;
    this.canvas = document.getElementById('intro');
    this.ctx = this.canvas.getContext('2d');
    this.paper = new paper.PaperScope().setup(this.canvas);
    this.paper.name = 'intro';
    this.animationEndTime = undefined;
    this.duration = 1000;


    window.addEventListener('intro', (e) => {
      this.isRunning ? this.stop() : this.start();
    }, false);

    this.callbackEvent = new Event('introEnd');
  }

  init() {
    this.mPath = new this.paper.Path(this.mPathJoined);
    this.mPathCloned = this.mPath.clone();
    this.mTreatment(0);

    this.mBisPath = new this.paper.Path(this.mbisPatJoined);
    this.mBisPathCloned = this.mBisPath.clone();
    this.mBisTreatment(0);

    this.cPath = new this.paper.Path(this.cPathJoined);
    this.cPathCloned = this.cPath.clone();
    this.cTreatment(0);

    // TEMP : mercenaires du cul -- JQUERY/CSS RIEN A FAIRE LA
    this.revealContent = $('.section-intro-content .reveal-hided');
    this.code = $('.mercenaires-du-code');
    this.cul = $('.mercenaires-du-cul');
    this.culWidth = this.cul.outerWidth(true) + 30;
    this.oups = this.revealContent.outerWidth(true) - this.culWidth;

    this.code.css({opacity: 0});
    this.revealContent.animate({left: '97%'}, this.duration - 500);

    setTimeout(() => {
      this.revealContent.stop(true, true).animate({left: `${this.oups}px`}, 200);
    }, this.duration - 500);

    setTimeout(() => {
      this.code.css({opacity: 1});
      this.cul.hide();
      this.revealContent.animate({left: '100%'}, 250);
    }, this.duration - 250);

    this.start();
  }

  start() {
    // animation
    this.isRunning = true;
    this.paper.view.onFrame = (time) => this.onFrame(time);
  }

  stop() {
    this.isRunning = false;
    // animation
    this.paper.view.onFrame = (time) => {};

    // clean
    this.cPathCloned.remove();
    this.mPathCloned.remove();
    this.mBisPathCloned.remove();
  }

  onFrame(time) {
    const now = Date.now();

    if (!this.animationEndTime || now > this.animationEndTime) {
      this.animationEndTime = now + this.duration;
    }

    // percent manager
    const percent = (this.duration - (this.animationEndTime - now)) / this.duration;

    // warn the loop is over
    if (percent > .99) {
      this.stopIntro = true;
    }

    if (this.stopIntro && !this.animFinished) {
      this.animFinished = true;
      this.finishIntro();
    }

    if (this.stopIntro) return;

    this.mTreatment(percent);
    this.cTreatment(percent);
    this.mBisTreatment(percent);
  }

  mTreatment(percent) {
    // m path treatment
    this.mPathCloned.remove();
    this.mPathCloned = this.mPath.clone();
    this.mPathCloned.segments[_.size(this.mPathCloned.segments) - 1].animationMark = true;

    const newPoint = this.mPathCloned.getNearestLocation(this.mPathCloned.getPointAtPercent(percent));
    this.mPathCloned.splitAt(newPoint);
    const markIndex = _.findIndex(this.mPathCloned.segments,'animationMark');
    this.mPathCloned.removeSegments(0, markIndex);
    this.mPathCloned.strokeColor = 'rgba(255,255,255,.4)';
  }

  mBisTreatment(percent) {
    // m path treatment
    this.mBisPathCloned.remove();
    this.mBisPathCloned = this.mBisPath.clone();
    this.mBisPathCloned.segments[0].animationMark = true;

    const newPoint = this.mBisPathCloned.getNearestLocation(this.mBisPathCloned.getPointAtPercent(percent));
    this.mBisPathCloned.splitAt(newPoint);
    const markIndex = _.findIndex(this.mBisPathCloned.segments,'animationMark');
    this.mBisPathCloned.removeSegments(0, markIndex);
    this.mBisPathCloned.strokeColor = 'rgba(255,255,255,.4)';
  }

  cTreatment(percent) {
    // m path treatment
    this.cPathCloned.remove();
    this.cPathCloned = this.cPath.clone();
    this.cPathCloned.segments[_.size(this.cPathCloned.segments) - 1].animationMark = true;

    const newPoint = this.cPathCloned.getNearestLocation(this.cPathCloned.getPointAtPercent(percent));
    this.cPathCloned.splitAt(newPoint);
    const markIndex = _.findIndex(this.cPathCloned.segments,'animationMark');
    this.cPathCloned.removeSegments(0, markIndex);
    this.cPathCloned.strokeColor = 'rgba(255,255,255,.4)';
  }

  finishIntro() {
    window.dispatchEvent(this.callbackEvent);
    this.stop();
  }
}

export default Intro;
