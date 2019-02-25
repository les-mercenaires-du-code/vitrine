import paper from 'paper';
import './index.scss';
import './canvas.scss';

import Util from './util.js';
import Step0 from './step0.js';
import Step1 from './step1.js';
import Step2 from './step2.js';

class Scene {
  constructor() {
    this.wW = 400;
    this.wH = 200;
    this.mdlW = this.wW / 2,
    this.mdlH = this.wH / 2;

    this.eventsManager = {
      step0: false,
      step1: false,
      step2: false,
    };
    this.eventsArr = Object.keys(this.eventsManager);
    this.eventsArrLength = this.eventsArr.length - 1;
    this.events = {
      // step1: new Event('step1'),
    };

    // document.body.onclick = (e) => {
    //   this.isBlack = !this.isBlack;
    //   let className = 'flex justify-center align-center';
    //   if (this.isBlack) {
    //     className += ' is-black';
    //   }
    //   document.body.className = className;
    // };
  }

  init() {
    // init step/event
    this.step0 = new Step0(this);
    this.step0.start();

    this.step1 = new Step1(this);
    this.step1.start();

    this.step2 = new Step2(this);
    this.step2.start();

    // trigger action
    // for (let i = 0;i <= this.eventsArrLength; i++) {
    //   const event = this.eventsArr[i];
    //
    //   if (this.eventsManager[event]) {
    //     this.createEvent(event);
    //   }
    // }

    // this.start();
  }

  start() {
    // fake event
    // this.targetIndex = 0;
    // this.target = this.eventsArr[this.targetIndex];
    //
    // this.oldTargetIndex = this.eventsArrLength - 1;
    // this.oldTarget = this.eventsArr[this.oldTargetIndex];
    //
    // let newVal = {};
    // newVal[this.oldTarget] = !this.eventsManager[this.oldTarget];
    // newVal[this.target] = !this.eventsManager[this.target];
    // this.eventsOrchestrator(newVal);

    setInterval(() => {
      // init step/event
      const step0 = this.eventsManager.step0;
      const step1 = this.eventsManager.step1;
      const newTarget = {
        step0: !step0,
        step1: !step1,
      }
      this.eventsOrchestrator(newTarget);
      return;
      // iterate between [index]
      // this.oldTargetIndex = this.targetIndex;
      // this.oldTarget = this.target;
      //
      // this.targetIndex = this.targetIndex + 1 > this.eventsArrLength ? 0 : this.targetIndex + 1;
      // this.target = this.eventsArr[this.targetIndex];
      //
      // let newVal = {};
      // newVal[this.oldTarget] = !this.eventsManager[this.oldTarget];
      // newVal[this.target] = !this.eventsManager[this.target];
      // this.eventsOrchestrator(newVal);
    }, 2000);
  }

  eventsOrchestrator(newTarget) {
    // console.log("--------");
    // console.log(newTarget,  this.eventsManager);
    const keys = Object.keys(newTarget);
    for (let i = 0;i <= keys.length; i++) {
      const event = keys[i];
      // console.log(i, event);
      const newValue = newTarget[event];
      if (this.eventsManager[event] !== newValue) {
        // console.log('-------->>>>>> event create', event);
        this.eventsManager[event] = newValue;
        this.createEvent(event, newValue);
      }
    }
  }

  createEvent(event, value) {
    console.log('event create', event);
    if (this.events[event]) {
      return window.dispatchEvent(this.events[event]);
    }
    this.events[event] = new Event(event);
    window.dispatchEvent(this.events[event]);
  }
}

const test = new Scene(paper);

window.onload = () => {
  test.init();
}

window.onresize = () => {
  test.step0.resize();
  test.step1.resize();
  test.step2.resize();
}
