import paper from 'paper';
import './assets/stylesheets/index.scss';
import {Intro, Flashinglights, Step0, Step1, Step2} from './components/index.js';
import $ from 'jquery';

class Scene {
  constructor() {
    this.$scene = {
      wW : 386,
      wH : 253,
      mdlW : 386 / 2,
      mdlH : 253 / 2,
    };


    // $('canvas').width(this.wW);
    // $('canvas').height(this.wH);
    $('canvas').width(386);
    $('canvas').height(253);


    this.eventsManager = {
      step0: false,
      step1: false,
      step2 : false,
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

    // $('body').on('click', () => {
    //   this.init();
    // });
    this.init();
  }

  init() {
    console.log(paper);
    // // FLASHING LIGHTS
    this.flash = new Flashinglights(this.$scene);
    // this.flash.init(this.$scene);

    setTimeout(() => {
      // this.flash.init(this.$scene);
      // this.intro.init(this.$scene);
    }, 1000)

    // CLOSE LIGHTS AND MAKE IT HAPPEN
    this.intro = new Intro(this.$scene);
    this.intro.init();

    // START CINEMATIC
    // init step/event
    window.addEventListener('introEnd', (e) => {
      this.step0 = new Step0(this.$scene);
      this.step0.start();
      // this.flash.init(this.$scene);

      setInterval(() => {
        // this.flash.init(this.$scene);
      }, 1000);
    }, false);


    // this.step1 = new Step1(this);
    // this.step1.start();
    //
    // this.step2 = new Step2(this);
    // this.step2.start();

    // trigger action
    for (let i = 0;i <= this.eventsArrLength; i++) {
      const event = this.eventsArr[i];

      if (this.eventsManager[event]) {
        this.createEvent(event);
      }
    }

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
      const newValue = newTarget[event];
      if (this.eventsManager[event] !== newValue) {
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

window.onload = () => {
  const test = new Scene(paper);
}
