import { AnyArrayType } from '../types';
export type ColumnarTable = {
    name: string;
    array: AnyArrayType;
    type: number;
}[];
/**
 * Encodes set of arrays into the Apache Arrow columnar format
 * https://arrow.apache.org/docs/format/Columnar.html#ipc-file-format
 * @param data - columns data
 * @param options - the writer options
 * @returns - encoded ArrayBuffer
 */
export declare function encodeArrowSync(data: ColumnarTable): ArrayBuffer;
//# sourceMappingURL=encode-arrow.d.ts.map