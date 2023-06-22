import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import type { ParseXMLOptions } from './lib/parsers/parse-xml';
export type XMLLoaderOptions = LoaderOptions & {
    xml?: ParseXMLOptions;
};
/**
 * Loader for XML files
 */
export declare const XMLLoader: LoaderWithParser<any, never, XMLLoaderOptions>;
//# sourceMappingURL=xml-loader.d.ts.map