import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
var _globalThis$navigator, _globalThis$navigator2;
const defaultPoolSize = (_globalThis$navigator = globalThis === null || globalThis === void 0 ? void 0 : (_globalThis$navigator2 = globalThis.navigator) === null || _globalThis$navigator2 === void 0 ? void 0 : _globalThis$navigator2.hardwareConcurrency) !== null && _globalThis$navigator !== void 0 ? _globalThis$navigator : 4;
export default class Pool {
  constructor() {
    let size = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultPoolSize;
    _defineProperty(this, "workers", void 0);
    _defineProperty(this, "idleWorkers", void 0);
    _defineProperty(this, "waitQueue", void 0);
    _defineProperty(this, "decoder", void 0);
    this.workers = [];
    this.idleWorkers = [];
    this.waitQueue = [];
    this.decoder = null;
    for (let i = 0; i < size; ++i) {
      const w = new Worker('./decoder.worker');
      this.workers.push(w);
      this.idleWorkers.push(w);
    }
  }
  async decode(fileDirectory, buffer) {
    const currentWorker = await this.waitForWorker();
    return new Promise((resolve, reject) => {
      currentWorker.onmessage = event => {
        this.finishTask(currentWorker);
        resolve(event.data[0]);
      };
      currentWorker.onerror = error => {
        this.finishTask(currentWorker);
        reject(error);
      };
      currentWorker.postMessage(['decode', fileDirectory, buffer], [buffer]);
    });
  }
  async waitForWorker() {
    const idleWorker = this.idleWorkers.pop();
    if (idleWorker) {
      return idleWorker;
    }
    const waiter = {};
    const promise = new Promise(resolve => {
      waiter.resolve = resolve;
    });
    this.waitQueue.push(waiter);
    return promise;
  }
  async finishTask(currentWorker) {
    const waiter = this.waitQueue.pop();
    if (waiter) {
      waiter.resolve(currentWorker);
    } else {
      this.idleWorkers.push(currentWorker);
    }
  }
  destroy() {
    for (let i = 0; i < this.workers.length; ++i) {
      this.workers[i].terminate();
    }
  }
}
//# sourceMappingURL=Pool.js.map