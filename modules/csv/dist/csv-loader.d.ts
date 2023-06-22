import type { LoaderWithParser, LoaderOptions } from '@loaders.gl/loader-utils';
import type { TableBatch } from '@loaders.gl/schema';
import { Table } from '@loaders.gl/schema';
export type CSVLoaderOptions = LoaderOptions & {
    csv?: {
        shape?: 'array-row-table' | 'object-row-table' | 'columnar-table';
        /** optimizes memory usage but increases parsing time. */
        optimizeMemoryUsage?: boolean;
        columnPrefix?: string;
        header?: 'auto';
        quoteChar?: string;
        escapeChar?: string;
        dynamicTyping?: boolean;
        comments?: boolean;
        skipEmptyLines?: boolean | 'greedy';
        delimitersToGuess?: string[];
    };
};
export declare const CSVLoader: LoaderWithParser<Table, TableBatch, CSVLoaderOptions>;
//# sourceMappingURL=csv-loader.d.ts.map