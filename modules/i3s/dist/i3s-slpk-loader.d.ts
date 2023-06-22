/// <reference types="node" />
import { LoaderOptions, LoaderWithParser } from '@loaders.gl/loader-utils';
export type SLPKLoaderOptions = LoaderOptions & {
    slpk?: {
        path?: string;
        pathMode?: 'http' | 'raw';
    };
};
/**
 * Loader for SLPK - Scene Layer Package
 */
export declare const SLPKLoader: LoaderWithParser<Buffer, never, SLPKLoaderOptions>;
//# sourceMappingURL=i3s-slpk-loader.d.ts.map