export default class LinkedList {
  constructor() {
    this.head = null;
  }

  push(value) {
    const node = {
      prev: this.head,
      next: null,
      value,
    };

    if (!this.head) {
      this.head = node;
      return;
    }

    let current = this.head;
    while (current && current.next) {
      current = current.next;
    }

    current.next = node;
  }

  find(node) {
    let current = this.head;

    while (current && current.next) {
      if (current === node) {
        console.log('found it');
        return node;
      }
      current = current.next;
    }
  }

  shift(node) {

    const current = this.head;
    current.prev = node;

    this.head = node;
    this.head.next = current;
    this.head.prev = null;
    return node;
  }

  unshift() {
    const current = this.head;
    this.head = current.next;
    this.head.prev = null;
    return current;
  }
}
