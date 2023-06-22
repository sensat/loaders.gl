"use strict";
// loaders.gl, MIT license
// Copyright 2022 Foursquare Labs, Inc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeTableAsCSV = void 0;
const schema_1 = require("@loaders.gl/schema");
const d3_dsv_1 = require("d3-dsv");
/**
 * Encode a Table object as CSV
 */
function encodeTableAsCSV(table, options = { csv: { useDisplayNames: true } }) {
    const useDisplayNames = options.useDisplayNames || options.csv?.useDisplayNames;
    const fields = table.schema?.fields || [];
    const columnNames = fields.map((f) => {
        // This is a leaky abstraction, assuming Kepler metadata
        const displayName = f.metadata?.displayName;
        return useDisplayNames && typeof displayName === 'string' ? displayName : f.name;
    });
    const formattedData = [columnNames];
    for (const row of (0, schema_1.makeArrayRowIterator)(table)) {
        const formattedRow = [];
        for (let columnIndex = 0; columnIndex < (0, schema_1.getTableNumCols)(table); ++columnIndex) {
            const value = row[columnIndex];
            formattedRow[columnIndex] = preformatFieldValue(value);
        }
        formattedData.push(formattedRow);
    }
    return (0, d3_dsv_1.csvFormatRows)(formattedData);
}
exports.encodeTableAsCSV = encodeTableAsCSV;
/**
 * Stringifies a value
 * @todo Why is it called parse?
 */
const preformatFieldValue = (value) => {
    if (value === null || value === undefined) {
        // TODO: It would be nice to distinguish between missing values and the empty string
        // https://github.com/d3/d3-dsv/issues/84
        return null;
    }
    if (value instanceof Date) {
        // d3-dsv formats dates without timezones if they don't have time info;
        // this forces them to always use fully-qualified ISO time strings
        return value.toISOString();
    }
    if (typeof value === 'object') {
        return JSON.stringify(value);
    }
    return String(value);
};
