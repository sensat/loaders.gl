import type { Loader, LoaderOptions } from '@loaders.gl/loader-utils';
import type { DracoMesh } from './lib/draco-types';
import type { DracoParseOptions } from './lib/draco-parser';
export type DracoLoaderOptions = LoaderOptions & {
    draco?: DracoParseOptions & {
        decoderType?: 'wasm' | 'js';
        libraryPath?: string;
        extraAttributes?: any;
        attributeNameEntry?: string;
        workerUrl?: string;
    };
};
/**
 * Worker loader for Draco3D compressed geometries
 */
export declare const DracoLoader: Loader<DracoMesh, never, DracoLoaderOptions>;
export declare const _TypecheckDracoLoader: Loader;
//# sourceMappingURL=draco-loader.d.ts.map