import { Table } from '@loaders.gl/schema';
export type CSVWriterOptions = {
    csv?: {
        useDisplayNames?: boolean;
    };
    /** @deprecated */
    useDisplayNames?: boolean;
};
/**
 * Encode a Table object as CSV
 */
export declare function encodeTableAsCSV(table: Table, options?: CSVWriterOptions): string;
//# sourceMappingURL=encode-csv.d.ts.map