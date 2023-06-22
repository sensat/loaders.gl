"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeObjectRowIterator = exports.makeArrayRowIterator = exports.makeRowIterator = exports.makeColumnarTable = exports.makeObjectRowTable = exports.makeArrayRowTable = exports.getTableRowAsArray = exports.getTableRowAsObject = exports.getTableColumnName = exports.getTableColumnIndex = exports.getTableRowShape = exports.getTableCellAt = exports.getTableCell = exports.getTableNumCols = exports.getTableLength = void 0;
/**
 * Returns the length of the table (i.e. the number of rows)
 */
function getTableLength(table) {
    switch (table.shape) {
        case 'array-row-table':
        case 'object-row-table':
        case 'geojson-row-table':
            return table.data.length;
        case 'arrow-table':
            return table.data.numRows;
        case 'columnar-table':
            for (const column of Object.values(table.data)) {
                return column.length || 0;
            }
            return 0;
        default:
            throw new Error('table');
    }
}
exports.getTableLength = getTableLength;
/**
 * Returns the number of columns in the table
 * @throws Fails to deduce number of columns if the table has no schema and is empty
 */
function getTableNumCols(table) {
    if (table.schema) {
        return table.schema.fields.length;
    }
    if (getTableLength(table) === 0) {
        throw new Error('empty table');
    }
    switch (table.shape) {
        case 'array-row-table':
            return table.data[0].length;
        case 'object-row-table':
        case 'geojson-row-table':
            return Object.keys(table.data[0]).length;
        case 'columnar-table':
            return Object.keys(table.data).length;
        case 'arrow-table':
            return table.data.numCols;
        default:
            throw new Error('table');
    }
}
exports.getTableNumCols = getTableNumCols;
/** Get a table cell value at row index and column name */
function getTableCell(table, rowIndex, columnName) {
    switch (table.shape) {
        case 'array-row-table':
            const columnIndex = getTableColumnIndex(table, columnName);
            return table.data[rowIndex][columnIndex];
        case 'object-row-table':
        case 'geojson-row-table':
            return table.data[rowIndex][columnName];
        case 'columnar-table':
            const column = table.data[columnName];
            return column[rowIndex];
        case 'arrow-table':
            const arrowColumnIndex = table.data.schema.fields.findIndex((field) => field.name === columnName);
            return table.data.getChildAt(arrowColumnIndex)?.get(rowIndex);
        default:
            throw new Error('todo');
    }
}
exports.getTableCell = getTableCell;
/** Get a table cell value at row index and column name */
function getTableCellAt(table, rowIndex, columnIndex) {
    switch (table.shape) {
        case 'array-row-table':
            return table.data[rowIndex][columnIndex];
        case 'object-row-table':
        case 'geojson-row-table':
            let columnName = getTableColumnName(table, columnIndex);
            return table.data[rowIndex][columnName];
        case 'columnar-table':
            columnName = getTableColumnName(table, columnIndex);
            const column = table.data[columnName];
            return column[rowIndex];
        case 'arrow-table':
            return table.data.getChildAt(columnIndex)?.get(rowIndex);
        default:
            throw new Error('todo');
    }
}
exports.getTableCellAt = getTableCellAt;
/** Deduce the table row shape */
function getTableRowShape(table) {
    switch (table.shape) {
        case 'array-row-table':
        case 'object-row-table':
            return table.shape;
        case 'geojson-row-table':
            return 'object-row-table';
        case 'columnar-table':
        default:
            throw new Error('Not a row table');
    }
}
exports.getTableRowShape = getTableRowShape;
/** Get the index of a named table column. Requires the table to have a schema */
function getTableColumnIndex(table, columnName) {
    const columnIndex = table.schema?.fields.findIndex((field) => field.name === columnName);
    if (columnIndex === undefined) {
        throw new Error(columnName);
    }
    return columnIndex;
}
exports.getTableColumnIndex = getTableColumnIndex;
/** Get the name of a table column by index. Requires the table to have a schema */
function getTableColumnName(table, columnIndex) {
    const columnName = table.schema?.fields[columnIndex]?.name;
    if (!columnName) {
        throw new Error(`${columnIndex}`);
    }
    return columnName;
}
exports.getTableColumnName = getTableColumnName;
/**
 * Returns one row of the table in object format.
 * @param target Optional parameter will be used if needed to store the row. Can be reused between calls to improve performance
 * @returns an array representing the row. May be the original array in the row, a new object, or the target parameter
 */
// eslint-disable-next-line complexity
function getTableRowAsObject(table, rowIndex, target, copy) {
    switch (table.shape) {
        case 'object-row-table':
            return copy ? Object.fromEntries(Object.entries(table.data[rowIndex])) : table.data[rowIndex];
        case 'array-row-table':
        case 'geojson-row-table':
            if (table.schema) {
                const objectRow = target || {};
                for (let i = 0; i < table.schema.fields.length; i++) {
                    objectRow[table.schema.fields[i].name] = table.data[rowIndex][i];
                }
                return objectRow;
            }
            throw new Error('no schema');
        case 'columnar-table':
            if (table.schema) {
                const objectRow = target || {};
                for (let i = 0; i < table.schema.fields.length; i++) {
                    objectRow[table.schema.fields[i].name] =
                        table.data[table.schema.fields[i].name][rowIndex];
                }
                return objectRow;
            }
            else {
                // eslint-disable-line no-else-return
                const objectRow = target || {};
                for (const [name, column] of Object.entries(table.data)) {
                    objectRow[name] = column[rowIndex];
                }
                return objectRow;
            }
        case 'arrow-table':
            const objectRow = target || {};
            const row = table.data.get(rowIndex);
            const schema = table.data.schema;
            for (let i = 0; i < schema.fields.length; i++) {
                objectRow[schema.fields[i].name] = row?.[schema.fields[i].name];
            }
            return objectRow;
        default:
            throw new Error('shape');
    }
}
exports.getTableRowAsObject = getTableRowAsObject;
/**
 * Returns one row of the table in array format.
 * @param target Optional parameter will be used if needed to store the row. Can be reused between calls to improve performance.
 * @returns an array representing the row. May be the original array in the row, a new object, or the target parameter
 */
// eslint-disable-next-line complexity
function getTableRowAsArray(table, rowIndex, target, copy) {
    switch (table.shape) {
        case 'array-row-table':
            return copy ? Array.from(table.data[rowIndex]) : table.data[rowIndex];
        case 'object-row-table':
        case 'geojson-row-table':
            if (table.schema) {
                const arrayRow = target || [];
                for (let i = 0; i < table.schema.fields.length; i++) {
                    arrayRow[i] = table.data[rowIndex][table.schema.fields[i].name];
                }
                return arrayRow;
            }
            // Warning: just slap on the values, this risks mismatches between rows
            return Object.values(table.data[rowIndex]);
        case 'columnar-table':
            if (table.schema) {
                const arrayRow = target || [];
                for (let i = 0; i < table.schema.fields.length; i++) {
                    arrayRow[i] = table.data[table.schema.fields[i].name][rowIndex];
                }
                return arrayRow;
            }
            else {
                // eslint-disable-line no-else-return
                const arrayRow = target || [];
                let i = 0;
                for (const column of Object.values(table.data)) {
                    arrayRow[i] = column[rowIndex];
                    i++;
                }
                return arrayRow;
            }
        case 'arrow-table':
            const arrayRow = target || [];
            const row = table.data.get(rowIndex);
            const schema = table.data.schema;
            for (let i = 0; i < schema.fields.length; i++) {
                arrayRow[i] = row?.[schema.fields[i].name];
            }
            return arrayRow;
        default:
            throw new Error('shape');
    }
}
exports.getTableRowAsArray = getTableRowAsArray;
/** Convert any table into array row format */
function makeArrayRowTable(table) {
    if (table.shape === 'array-row-table') {
        return table;
    }
    const length = getTableLength(table);
    const data = new Array(length);
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
        data[rowIndex] = getTableRowAsArray(table, rowIndex);
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
    const length = getTableLength(table);
    const data = new Array(length);
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
        data[rowIndex] = getTableRowAsObject(table, rowIndex);
    }
    return {
        shape: 'object-row-table',
        schema: table.schema,
        data
    };
}
exports.makeObjectRowTable = makeObjectRowTable;
/** Convert any table into object row format */
function makeColumnarTable(table) {
    if (table.shape === 'object-row-table') {
        return table;
    }
    const length = getTableLength(table);
    const data = new Array(length);
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
        data[rowIndex] = getTableRowAsObject(table, rowIndex);
    }
    return {
        shape: 'object-row-table',
        schema: table.schema,
        data
    };
}
exports.makeColumnarTable = makeColumnarTable;
// Row Iterators
/**
 * Iterate over table rows
 * @param table
 * @param shape
 */
function* makeRowIterator(table, shape) {
    switch (shape) {
        case 'array-row-table':
            yield* makeArrayRowIterator(table);
            break;
        case 'object-row-table':
            yield* makeObjectRowIterator(table);
            break;
        default:
            throw new Error(`Unknown row type ${shape}`);
    }
}
exports.makeRowIterator = makeRowIterator;
/**
 * Streaming processing: Iterate over table, yielding array rows
 * @param table
 * @param shape
 */
function* makeArrayRowIterator(table, target = []) {
    const length = getTableLength(table);
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
        yield getTableRowAsArray(table, rowIndex, target);
    }
}
exports.makeArrayRowIterator = makeArrayRowIterator;
/**
 * Streaming processing: Iterate over table, yielding object rows
 * @param table
 * @param shape
 */
function* makeObjectRowIterator(table, target = {}) {
    const length = getTableLength(table);
    for (let rowIndex = 0; rowIndex < length; rowIndex++) {
        yield getTableRowAsObject(table, rowIndex, target);
    }
}
exports.makeObjectRowIterator = makeObjectRowIterator;
