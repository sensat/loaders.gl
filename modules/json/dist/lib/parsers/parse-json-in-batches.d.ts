import type { TableBatch } from '@loaders.gl/schema';
import type { JSONLoaderOptions } from '../../json-loader';
export declare function parseJSONInBatches(binaryAsyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>, options: JSONLoaderOptions): AsyncIterable<TableBatch>;
export declare function rebuildJsonObject(batch: any, data: any): any;
//# sourceMappingURL=parse-json-in-batches.d.ts.map