"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlobStreamController = void 0;
/**
 * Forked from @gozala's web-blob under MIT license
 * @see https://github.com/Gozala/web-blob
 */
class BlobStreamController {
    /**
     * @param chunks
     */
    constructor(chunks) {
        this.isWorking = false;
        this.isCancelled = false;
        this.chunks = chunks;
    }
    /**
     * @param controller
     */
    start(controller) {
        this.work(controller); // eslint-disable-line @typescript-eslint/no-floating-promises
    }
    /**
     *
     * @param controller
     */
    async work(controller) {
        const { chunks } = this;
        this.isWorking = true;
        while (!this.isCancelled && (controller.desiredSize || 0) > 0) {
            let next;
            try {
                next = chunks.next();
            }
            catch (error) {
                controller.error(error);
                break;
            }
            if (next) {
                if (!next.done && !this.isCancelled) {
                    controller.enqueue(next.value);
                }
                else {
                    controller.close();
                }
            }
        }
        this.isWorking = false;
    }
    /**
     *
     * @param {ReadableStreamDefaultController} controller
     */
    pull(controller) {
        if (!this.isWorking) {
            this.work(controller); // eslint-disable-line @typescript-eslint/no-floating-promises
        }
    }
    cancel() {
        this.isCancelled = true;
    }
}
exports.BlobStreamController = BlobStreamController;
