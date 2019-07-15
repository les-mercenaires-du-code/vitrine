import LinkedList from './linkedList';

/**
 * Queue
 * 1.0.0
 */

export default class Queue {
  constructor(config) {
    this.config = config || {};
  }

  init() {
    console.log('*********** init queues ***************');
    const linked = new LinkedList();
    console.log(linked);
    linked.push('yo1');
    console.log(linked);
    linked.push('yo2');
    console.log(linked);
    linked.push('yo3');
    console.log(linked);
  }
}
