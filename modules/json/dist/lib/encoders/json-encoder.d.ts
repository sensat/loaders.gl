import { Table } from '@loaders.gl/schema';
type RowArray = unknown[];
type RowObject = {
    [key: string]: unknown;
};
type TableJSON = RowArray[] | RowObject[];
export type JSONWriterOptions = {
    shape?: 'object-row-table' | 'array-row-table';
    wrapper?: (table: TableJSON) => unknown;
};
/**
 * Encode a table as a JSON string
 */
export declare function encodeTableAsJSON(table: Table, options?: JSONWriterOptions): string;
export {};
//# sourceMappingURL=json-encoder.d.ts.map