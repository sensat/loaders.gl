import type { LoaderWithParser } from '@loaders.gl/loader-utils';
import type { ObjectRowTable } from '@loaders.gl/schema';
import type { ExcelLoaderOptions } from './excel-loader';
import { ExcelLoader as ExcelWorkerLoader } from './excel-loader';
export type { ExcelLoaderOptions };
export { ExcelWorkerLoader };
/**
 * Loader for Excel files
 */
export declare const ExcelLoader: LoaderWithParser<ObjectRowTable, never, ExcelLoaderOptions>;
//# sourceMappingURL=index.d.ts.map