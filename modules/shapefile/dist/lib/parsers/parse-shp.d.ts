import type { BinaryGeometry } from '@loaders.gl/schema';
import { SHPLoaderOptions } from './types';
export declare function parseSHP(arrayBuffer: ArrayBuffer, options?: SHPLoaderOptions): BinaryGeometry[];
/**
 * @param asyncIterator
 * @param options
 * @returns
 */
export declare function parseSHPInBatches(asyncIterator: AsyncIterable<ArrayBuffer> | Iterable<ArrayBuffer>, options?: SHPLoaderOptions): AsyncIterable<BinaryGeometry | object>;
//# sourceMappingURL=parse-shp.d.ts.map