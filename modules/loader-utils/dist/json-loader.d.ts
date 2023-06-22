import type { LoaderWithParser, LoaderOptions } from './types';
import type { Table, TableBatch } from '@loaders.gl/schema';
export type JSONLoaderOptions = LoaderOptions;
/**
 * A JSON Micro loader (minimal bundle size)
 * Alternative to `@loaders.gl/json`
 */
export declare const JSONLoader: LoaderWithParser<Table, TableBatch, JSONLoaderOptions>;
//# sourceMappingURL=json-loader.d.ts.map