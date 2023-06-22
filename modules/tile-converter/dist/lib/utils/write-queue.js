"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const queue_1 = require("./queue");
const process_1 = __importDefault(require("process"));
/** Memory limit size is based on testing */
const MEMORY_LIMIT = 4 * 1024 * 1024 * 1024; // 4GB
class WriteQueue extends queue_1.Queue {
    constructor(listeningInterval = 2000, writeConcurrency = 400) {
        super();
        this.writePromise = null;
        this.fileMap = {};
        this.listeningInterval = listeningInterval;
        this.writeConcurrency = writeConcurrency;
    }
    async enqueue(val, writeImmediately = false) {
        if (writeImmediately) {
            const { archiveKey, writePromise } = val;
            const result = await writePromise();
            if (archiveKey && result) {
                this.fileMap[archiveKey] = result;
            }
        }
        else {
            super.enqueue(val);
            /** https://nodejs.org/docs/latest-v14.x/api/process.html#process_process_memoryusage */
            if (process_1.default.memoryUsage().rss > MEMORY_LIMIT) {
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
                const { archiveKey, writePromise } = item;
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
exports.default = WriteQueue;
