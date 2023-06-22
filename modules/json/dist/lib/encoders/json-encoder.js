"use strict";
// loaders.gl, MIT license
// Copyright 2022 Foursquare Labs, Inc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeTableAsJSON = void 0;
const schema_1 = require("@loaders.gl/schema");
/**
 * Encode a table as a JSON string
 */
function encodeTableAsJSON(table, options = {}) {
    const shape = options.shape || 'object-row-table';
    const strings = [];
    const rowIterator = (0, schema_1.makeRowIterator)(table, shape);
    for (const row of rowIterator) {
        // Round elements etc
        // processRow(wrappedRow, table.schema);
        // const wrappedRow = options.wrapper ? options.wrapper(row) : row;
        strings.push(JSON.stringify(row));
    }
    return `[${strings.join(',')}]`;
}
exports.encodeTableAsJSON = encodeTableAsJSON;
