type HashOptions = {
    modules?: {
        [moduleName: string]: any;
    };
    crypto?: {
        onEnd?: (result: {
            hash: string;
        }) => any;
    };
};
/** Abstract hash base class */
export declare abstract class Hash {
    abstract readonly name: string;
    abstract readonly options: HashOptions;
    constructor(options?: HashOptions);
    preload(): Promise<void>;
    abstract hash(arrayBuffer: ArrayBuffer): Promise<string>;
    hashBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>): AsyncIterable<ArrayBuffer>;
    protected concatenate(asyncIterator: any): Promise<ArrayBuffer>;
}
export {};
//# sourceMappingURL=hash.d.ts.map