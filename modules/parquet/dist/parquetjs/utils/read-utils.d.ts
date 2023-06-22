/// <reference types="node" />
import { FileMetaData, PageHeader } from '../parquet-thrift';
/**
 * Helper function that serializes a thrift object into a buffer
 */
export declare function serializeThrift(obj: any): Buffer;
export declare function decodeThrift(obj: any, buf: Buffer, offset?: number): number;
/**
 * FIXME not ideal that this is linear
 */
export declare function getThriftEnum(klass: any, value: number | string): string;
export declare function decodeFileMetadata(buf: Buffer, offset?: number): {
    length: number;
    metadata: FileMetaData;
};
export declare function decodePageHeader(buf: Buffer, offset?: number): {
    length: number;
    pageHeader: PageHeader;
};
/**
 * Get the number of bits required to store a given value
 */
export declare function getBitWidth(val: number): number;
export declare function fieldIndexOf(arr: string[][], elem: string[]): number;
//# sourceMappingURL=read-utils.d.ts.map