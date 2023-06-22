import { ObjectRowTable } from '@loaders.gl/schema';
import { DBFLoaderOptions, DBFTableOutput, DBFHeader, DBFRowsOutput } from './types';
/**
 * @param arrayBuffer
 * @param options
 * @returns DBFTable or rows
 */
export declare function parseDBF(arrayBuffer: ArrayBuffer, options?: DBFLoaderOptions): DBFRowsOutput | DBFTableOutput | ObjectRowTable;
/**
 * @param asyncIterator
 * @param options
 */
export declare function parseDBFInBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>, options?: DBFLoaderOptions): AsyncIterable<DBFHeader | DBFRowsOutput | DBFTableOutput>;
//# sourceMappingURL=parse-dbf.d.ts.map