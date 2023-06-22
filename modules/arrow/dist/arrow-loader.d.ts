import type { Loader, LoaderOptions } from '@loaders.gl/loader-utils';
import type { ArrowTable } from '@loaders.gl/schema';
export type ArrowLoaderOptions = LoaderOptions & {
    arrow?: {
        shape: 'arrow-table' | 'columnar-table' | 'row-table' | 'array-row-table' | 'object-row-table';
    };
};
/** ArrowJS table loader */
export declare const ArrowLoader: Loader<ArrowTable, never, ArrowLoaderOptions>;
export declare const _typecheckArrowLoader: Loader;
//# sourceMappingURL=arrow-loader.d.ts.map