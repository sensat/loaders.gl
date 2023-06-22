import { ArrayType } from '@loaders.gl/schema';
import { ParquetRowGroup, ParquetRow } from './declare';
import { ParquetSchema } from './schema';
export { ParquetRowGroup };
export declare function shredBuffer(schema: ParquetSchema): ParquetRowGroup;
/**
 * 'Shred' a record into a list of <value, repetition_level, definition_level>
 * tuples per column using the Google Dremel Algorithm..
 *
 * The rowGroup argument must point to an object into which the shredded record
 * will be returned. You may re-use the rowGroup for repeated calls to this function
 * to append to an existing rowGroup, as long as the schema is unchanged.
 *
 * The format in which the shredded records will be stored in the rowGroup is as
 * follows:
 *
 *   rowGroup = {
 *     columnData: [
 *       'my_col': {
 *          dlevels: [d1, d2, .. dN],
 *          rlevels: [r1, r2, .. rN],
 *          values: [v1, v2, .. vN],
 *        }, ...
 *      ],
 *      rowCount: X,
 *   }
 */
export declare function shredRecord(schema: ParquetSchema, record: ParquetRow, rowGroup: ParquetRowGroup): void;
/**
 * 'Materialize' a list of <value, repetition_level, definition_level>
 * tuples back to nested records (objects/arrays) using the Google Dremel
 * Algorithm..
 *
 * The rowGroup argument must point to an object with the following structure (i.e.
 * the same structure that is returned by shredRecords):
 *
 *   rowGroup = {
 *     columnData: [
 *       'my_col': {
 *          dlevels: [d1, d2, .. dN],
 *          rlevels: [r1, r2, .. rN],
 *          values: [v1, v2, .. vN],
 *        }, ...
 *      ],
 *      rowCount: X,
 *   }
 */
export declare function materializeRows(schema: ParquetSchema, rowGroup: ParquetRowGroup): ParquetRow[];
/**
 * 'Materialize' a list of <value, repetition_level, definition_level>
 * tuples back to nested records (objects/arrays) using the Google Dremel
 * Algorithm..
 *
 * The rowGroup argument must point to an object with the following structure (i.e.
 * the same structure that is returned by shredRecords):
 *
 *   rowGroup = {
 *     columnData: [
 *       'my_col': {
 *          dlevels: [d1, d2, .. dN],
 *          rlevels: [r1, r2, .. rN],
 *          values: [v1, v2, .. vN],
 *        }, ...
 *      ],
 *      rowCount: X,
 *   }
 */
export declare function materializeColumns(schema: ParquetSchema, rowGroup: ParquetRowGroup): Record<string, ArrayType>;
//# sourceMappingURL=shred.d.ts.map