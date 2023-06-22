import type { Loader, LoaderOptions } from '@loaders.gl/loader-utils';
import type { ObjectRowTable } from '@loaders.gl/schema';
export type ExcelLoaderOptions = LoaderOptions & {
    excel?: {
        shape: 'object-row-table';
        sheet?: string;
    };
};
/**
 * Worker Loader for Excel files
 */
export declare const ExcelLoader: Loader<ObjectRowTable, never, ExcelLoaderOptions>;
export declare const _typecheckLoader: Loader;
//# sourceMappingURL=excel-loader.d.ts.map