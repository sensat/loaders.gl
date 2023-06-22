"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArrowLikeTable = void 0;
const arrow_like_schema_1 = require("./arrow-like-schema");
const table_schema_1 = require("../simple-table/table-schema");
const table_accessors_1 = require("../simple-table/table-accessors");
class ArrowLikeVector {
    constructor(table, columnName) {
        this.table = table;
        this.columnName = columnName;
    }
    get(rowIndex) {
        return (0, table_accessors_1.getTableCell)(this.table, rowIndex, this.columnName);
    }
    toArray() {
        switch (this.table.shape) {
            case 'arrow-table':
                return this.table.data.getChild(this.columnName)?.toArray();
            case 'columnar-table':
                return this.table.data[this.columnName];
            default:
                throw new Error(this.table.shape);
        }
    }
}
/**
 * Class that provides an API similar to Apache Arrow Table class
 * Forwards methods directly if the underlying table is Arrow, otherwise calls accessor functions
 */
class ArrowLikeTable {
    constructor(table) {
        const schema = table.schema || (0, table_schema_1.deduceTableSchema)(table);
        this.schema = new arrow_like_schema_1.ArrowLikeSchema(schema.fields, schema.metadata);
        this.table = { ...table, schema };
    }
    // get schema() {
    //   return this.table.schema;
    // }
    get data() {
        return this.table.data;
    }
    get numCols() {
        return (0, table_accessors_1.getTableNumCols)(this.table);
    }
    get length() {
        return (0, table_accessors_1.getTableLength)(this.table);
    }
    getChild(columnName) {
        return new ArrowLikeVector(this.table, columnName);
    }
}
exports.ArrowLikeTable = ArrowLikeTable;
