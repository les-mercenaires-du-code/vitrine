class Util {
  constructor($scene) {
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random()*(max-min+1)+min);;
  }

  getRandomIntNoZero(min, max) {
    let random = Math.floor(Math.random()*(max-min+1)+min);
    while(!random) {
      random = Math.floor(Math.random()*(max-min+1)+min);
    }
    return random;
  }

  linear(t) {
    return t
  }

  easeInQuad(t) {
    return t * t
  }

  easeOutQuad(t) {
    return t * (2 - t)
  }

  easeInOutQuad(t) {
    return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  easeInCubic(t) {
    return t * t * t
  }

  easeOutCubic(t) {
    return (--t) * t * t + 1
  }

  easeInOutCubic(t) {
    return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1
  }

  easeInQuart(t) {
    return t * t * t * t
  }

  easeOutQuart(t) {
    return 1 - (--t) * t * t * t
  }

  easeInOutQuart(t) {
    return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t
  }

  easeInQuint(t) {
    return t * t * t * t * t
  }

  easeOutQuint(t) {
    return 1 + (--t) * t * t * t * t
  }

  easeInOutQuint(t) {
    return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t
  }
}

export default new Util();
