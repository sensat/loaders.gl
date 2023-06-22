"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeObjectRowTable = exports.makeArrayRowTable = exports.makeColumnarTable = void 0;
// loaders.gl, MIT license
const table_accessors_1 = require("./table-accessors");
const table_schema_1 = require("./table-schema");
const table_column_1 = require("./table-column");
/** Convert any simple table into columnar format */
function makeColumnarTable(table) {
    // TODO - should schema really be optional?
    const schema = table.schema || (0, table_schema_1.deduceTableSchema)(table);
    const fields = table.schema?.fields || [];
    if (table.shape === 'columnar-table') {
        return { ...table, schema };
    }
    const length = (0, table_accessors_1.getTableLength)(table);
    const columns = {};
    for (const field of fields) {
        const column = (0, table_column_1.makeColumnFromField)(field, length);
        columns[field.name] = column;
        for (let rowIndex = 0; rowIndex < length; rowIndex++) {
            column[rowIndex] = (0, table_accessors_1.getTableCell)(table, rowIndex, field.name);
        }
    }
    return {
        shape: 'columnar-table',
        schema,
        data: columns
    };
}
exports.makeColumnarTable = makeColumnarTable;
/** Convert any table into array row format */
function makeArrayRowTable(table) {
    if (table.shape === 'array-row-table') {
        return table;
    }
    const length = (0, table_accessors_1.getTableLength)(table);
    const data = new Array(length);
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
        data[rowIndex] = (0, table_accessors_1.getTableRowAsArray)(table, rowIndex);
    }
    return {
        shape: 'array-row-table',
        schema: table.schema,
        data
    };
}
exports.makeArrayRowTable = makeArrayRowTable;
/** Convert any table into object row format */
function makeObjectRowTable(table) {
    if (table.shape === 'object-row-table') {
        return table;
    }
    const length = (0, table_accessors_1.getTableLength)(table);
    const data = new Array(length);
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
        data[rowIndex] = (0, table_accessors_1.getTableRowAsObject)(table, rowIndex);
    }
    return {
        shape: 'object-row-table',
        schema: table.schema,
        data
    };
}
exports.makeObjectRowTable = makeObjectRowTable;
