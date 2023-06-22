/**
 *
 */
export declare function decompressReadStream(readStream: any, headers: any): any;
/**
 *
 * @param readStream
 * @returns
 */
export declare function concatenateReadStream(readStream: any): Promise<ArrayBuffer>;
/**
 * Concatenate a sequence of ArrayBuffers
 * @return A concatenated ArrayBuffer
 * @note duplicates loader-utils since polyfills should be independent
 */
export declare function concatenateArrayBuffers(sources: (ArrayBuffer | Uint8Array)[]): ArrayBuffer;
//# sourceMappingURL=stream-utils.node.d.ts.map