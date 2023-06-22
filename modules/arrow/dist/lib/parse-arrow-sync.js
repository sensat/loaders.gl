"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apache_arrow_1 = require("apache-arrow");
// Parses arrow to a columnar table
function parseArrowSync(arrayBuffer, options) {
    const arrowTable = (0, apache_arrow_1.tableFromIPC)([new Uint8Array(arrayBuffer)]);
    // Extract columns
    // TODO - avoid calling `getColumn` on columns we are not interested in?
    // Add options object?
    const columnarTable = {};
    for (const field of arrowTable.schema.fields) {
        // This (is intended to) coalesce all record batches into a single typed array
        const arrowColumn = arrowTable.getChild(field.name);
        const values = arrowColumn?.toArray();
        columnarTable[field.name] = values;
    }
    switch (options?.arrow?.shape) {
        case 'arrow-table':
            return arrowTable;
        case 'object-row-table':
            return convertColumnarToRowFormatTable(columnarTable);
        case 'columnar-table':
        default:
            return columnarTable;
    }
}
exports.default = parseArrowSync;
function convertColumnarToRowFormatTable(columnarTable) {
    const tableKeys = Object.keys(columnarTable);
    const tableRowsCount = columnarTable[tableKeys[0]].length;
    const rowFormatTable = [];
    for (let index = 0; index < tableRowsCount; index++) {
        const tableItem = {};
        for (let keyIndex = 0; keyIndex < tableKeys.length; keyIndex++) {
            const fieldName = tableKeys[keyIndex];
            tableItem[fieldName] = columnarTable[fieldName][index];
        }
        rowFormatTable.push(tableItem);
    }
    return rowFormatTable;
}
