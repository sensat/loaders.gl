import type { Table, TableBatch } from '@loaders.gl/schema';
import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
type ParseJSONOptions = {
    shape?: 'row-table';
    table?: boolean;
    jsonpaths?: string[];
};
/**
 * @param table -
 * @param jsonpaths -
 */
export type JSONLoaderOptions = LoaderOptions & {
    json?: ParseJSONOptions;
};
export declare const JSONLoader: LoaderWithParser<Table, TableBatch, JSONLoaderOptions>;
export {};
//# sourceMappingURL=json-loader.d.ts.map