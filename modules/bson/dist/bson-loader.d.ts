import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import type { ParseBSONOptions } from './lib/parsers/parse-bson';
/**
 * @param table -
 * @param bsonpaths -
 */
export type BSONLoaderOptions = LoaderOptions & {
    bson?: ParseBSONOptions;
};
export declare const BSONLoader: LoaderWithParser<Record<string, unknown>, never, BSONLoaderOptions>;
//# sourceMappingURL=bson-loader.d.ts.map