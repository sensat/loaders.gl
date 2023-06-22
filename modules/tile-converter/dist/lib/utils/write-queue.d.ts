import { Queue } from './queue';
export type WriteQueueItem = {
    archiveKey?: string;
    /**
     * writePromise() returns a Promise that will be awaited in Promise.allSettled(promises);
     * Arguments for this call are specified in writeQueue.enqueue call like this:
     * await writeQueue.enqueue({
     *     archiveKey: `nodePages/xxx.json.gz`,
     *     writePromise: () => writeFileForSlpk(slpkPath, data, `xxx.json`)
     * });
     * Note, a function like writeFileForSlpk should NOT be called when initializing the object for enqueue().
     * If he function is called, the promise will be created
     * and the function will allocate resources (file descriptors) for file writing.
     * It will be done for ALL items in the queue, which is not supposed to happen.
     * That's why the function should be passed as
     *   writePromise: () => writeFileForSlpk(slpkPath, content, `xxx.json`)
     * instead of
     *  writePromise: writeFileForSlpk(slpkPath, content, `xxx.json`) // INCORRECT !
     */
    writePromise: () => Promise<string | null>;
};
export default class WriteQueue<T extends WriteQueueItem> extends Queue<T> {
    private intervalId?;
    writePromise: Promise<void> | null;
    fileMap: {
        [key: string]: string;
    };
    listeningInterval: number;
    writeConcurrency: number;
    constructor(listeningInterval?: number, writeConcurrency?: number);
    enqueue(val: T, writeImmediately?: boolean): Promise<void>;
    startListening(): void;
    stopListening(): void;
    startWrite(): Promise<void>;
    finalize(): Promise<void>;
    private doWrite;
    private updateFileMap;
}
//# sourceMappingURL=write-queue.d.ts.map