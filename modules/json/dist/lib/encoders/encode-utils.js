"use strict";
// loaders.gl, MIT license
// Copyright 2022 Foursquare Labs, Inc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRowPropertyObject = exports.detectGeometryColumnIndex = void 0;
const schema_1 = require("@loaders.gl/schema");
/**
 * Attempts to identify which column contains geometry
 * Currently just returns name (key) of first object-valued column
 * @todo look for hints in schema metadata
 * @todo look for WKB
 */
function detectGeometryColumnIndex(table) {
    // TODO - look for hints in schema metadata
    // look for a column named geometry
    const geometryIndex = table.schema?.fields.findIndex((field) => field.name === 'geometry') ?? -1;
    if (geometryIndex > -1) {
        return geometryIndex;
    }
    // look at the data
    // TODO - this drags in the indices
    if ((0, schema_1.getTableLength)(table) > 0) {
        const row = (0, schema_1.getTableRowAsArray)(table, 0);
        for (let columnIndex = 0; columnIndex < (0, schema_1.getTableNumCols)(table); columnIndex++) {
            const value = row?.[columnIndex];
            if (value && typeof value === 'object') {
                return columnIndex;
            }
        }
    }
    throw new Error('Failed to detect geometry column');
}
exports.detectGeometryColumnIndex = detectGeometryColumnIndex;
/**
 * Return a row as a property (key/value) object, excluding selected columns
 */
function getRowPropertyObject(table, row, excludeColumnIndices = []) {
    const properties = {};
    for (let columnIndex = 0; columnIndex < (0, schema_1.getTableNumCols)(table); ++columnIndex) {
        const columnName = table.schema?.fields[columnIndex].name;
        if (columnName && !excludeColumnIndices.includes(columnIndex)) {
            properties[columnName] = row[columnName];
        }
    }
    return properties;
}
exports.getRowPropertyObject = getRowPropertyObject;
