/// <reference types="node" />
import type { PrimitiveType } from '../schema/declare';
import type { CursorBuffer, ParquetCodecOptions } from './declare';
export declare function encodeValues(type: PrimitiveType, values: any[], opts: ParquetCodecOptions): Buffer;
export declare function decodeValues(type: PrimitiveType, cursor: CursorBuffer, count: number, opts: ParquetCodecOptions): any[];
//# sourceMappingURL=plain.d.ts.map