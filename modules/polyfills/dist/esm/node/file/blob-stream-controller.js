import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
export class BlobStreamController {
  constructor(chunks) {
    _defineProperty(this, "chunks", void 0);
    _defineProperty(this, "isWorking", false);
    _defineProperty(this, "isCancelled", false);
    this.chunks = chunks;
  }
  start(controller) {
    this.work(controller);
  }
  async work(controller) {
    const {
      chunks
    } = this;
    this.isWorking = true;
    while (!this.isCancelled && (controller.desiredSize || 0) > 0) {
      let next;
      try {
        next = chunks.next();
      } catch (error) {
        controller.error(error);
        break;
      }
      if (next) {
        if (!next.done && !this.isCancelled) {
          controller.enqueue(next.value);
        } else {
          controller.close();
        }
      }
    }
    this.isWorking = false;
  }
  pull(controller) {
    if (!this.isWorking) {
      this.work(controller);
    }
  }
  cancel() {
    this.isCancelled = true;
  }
}
//# sourceMappingURL=blob-stream-controller.js.map