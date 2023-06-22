import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { Queue } from './queue';
import process from 'process';
const MEMORY_LIMIT = 4 * 1024 * 1024 * 1024;
export default class WriteQueue extends Queue {
  constructor() {
    let listeningInterval = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 2000;
    let writeConcurrency = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 400;
    super();
    _defineProperty(this, "intervalId", void 0);
    _defineProperty(this, "writePromise", null);
    _defineProperty(this, "fileMap", {});
    _defineProperty(this, "listeningInterval", void 0);
    _defineProperty(this, "writeConcurrency", void 0);
    this.listeningInterval = listeningInterval;
    this.writeConcurrency = writeConcurrency;
  }
  async enqueue(val) {
    let writeImmediately = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
    if (writeImmediately) {
      const {
        archiveKey,
        writePromise
      } = val;
      const result = await writePromise();
      if (archiveKey && result) {
        this.fileMap[archiveKey] = result;
      }
    } else {
      super.enqueue(val);
      if (process.memoryUsage().rss > MEMORY_LIMIT) {
        await this.startWrite();
      }
    }
  }
  startListening() {
    this.intervalId = setInterval(this.startWrite.bind(this), this.listeningInterval);
  }
  stopListening() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
  async startWrite() {
    if (!this.writePromise) {
      this.writePromise = this.doWrite();
    }
    await this.writePromise;
    this.writePromise = null;
  }
  async finalize() {
    this.stopListening();
    await this.startWrite();
  }
  async doWrite() {
    while (this.length) {
      const promises = [];
      const archiveKeys = [];
      for (let i = 0; i < this.writeConcurrency; i++) {
        const item = this.dequeue();
        if (!item) {
          break;
        }
        const {
          archiveKey,
          writePromise
        } = item;
        archiveKeys.push(archiveKey);
        const promise = writePromise();
        promises.push(promise);
      }
      const writeResults = await Promise.allSettled(promises);
      this.updateFileMap(archiveKeys, writeResults);
    }
  }
  updateFileMap(archiveKeys, writeResults) {
    for (let i = 0; i < archiveKeys.length; i++) {
      const archiveKey = archiveKeys[i];
      if (archiveKey && 'value' in writeResults[i]) {
        this.fileMap[archiveKey] = writeResults[i].value;
      }
    }
  }
}
//# sourceMappingURL=write-queue.js.map