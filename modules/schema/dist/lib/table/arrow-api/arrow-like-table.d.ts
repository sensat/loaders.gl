import { Table } from '../../../types/category-table';
import { ArrowLikeSchema } from './arrow-like-schema';
declare class ArrowLikeVector {
    table: Table;
    columnName: string;
    constructor(table: Table, columnName: string);
    get(rowIndex: number): unknown;
    toArray(): ArrayLike<unknown>;
}
/**
 * Class that provides an API similar to Apache Arrow Table class
 * Forwards methods directly if the underlying table is Arrow, otherwise calls accessor functions
 */
export declare class ArrowLikeTable {
    schema: ArrowLikeSchema;
    table: Table;
    constructor(table: Table);
    get data(): any[][] | {
        [columnName: string]: any;
    }[] | import("geojson").Feature<import("geojson").Geometry, import("geojson").GeoJsonProperties>[] | {
        [columnName: string]: ArrayLike<unknown>;
    } | import("apache-arrow").Table<any>;
    get numCols(): number;
    get length(): number;
    getChild(columnName: string): ArrowLikeVector;
}
export {};
//# sourceMappingURL=arrow-like-table.d.ts.map