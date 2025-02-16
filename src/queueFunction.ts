export default class QueueFunction {
  queue = [];
  isRunning = false;
  enqueue(callback: () => any) {
    this.queue.push(callback);
    this.processQueue();
  }
  async processQueue() {
    if (this.isRunning || this.queue.length === 0) {
      return;
    }

    this.isRunning = true;
    const nextFunc = this.queue.shift();
    const result = nextFunc();

    if (result instanceof Promise) {
      await result;
    }
    this.isRunning = false;
    this.processQueue();
  }

  clear() {
    this.queue = [];
    this.isRunning = false;
  }

  get length() {
    return this.queue.length;
  }

  get isEmpty() {
    return this.queue.length === 0 && !this.isRunning;
  }
}
