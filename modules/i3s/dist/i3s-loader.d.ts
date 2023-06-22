import type { LoaderWithParser } from '@loaders.gl/loader-utils';
import { I3SParseOptions } from './types';
import { LoaderOptions } from './../../loader-utils/src/types';
export type I3SLoaderOptions = LoaderOptions & {
    i3s?: I3SParseOptions;
};
/**
 * Loader for I3S - Indexed 3D Scene Layer
 */
export declare const I3SLoader: LoaderWithParser;
//# sourceMappingURL=i3s-loader.d.ts.map