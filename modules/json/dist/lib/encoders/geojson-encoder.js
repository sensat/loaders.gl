"use strict";
// loaders.gl, MIT license
// Copyright 2022 Foursquare Labs, Inc.
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeTableAsGeojsonInBatches = void 0;
const schema_1 = require("@loaders.gl/schema");
const schema_2 = require("@loaders.gl/schema");
const encode_utils_1 = require("./encode-utils");
const utf8_encoder_1 = require("./utf8-encoder");
/**
 * Encode a table as GeoJSON
 */
// eslint-disable-next-line max-statements
async function* encodeTableAsGeojsonInBatches(batchIterator, // | Iterable<TableBatch>,
inputOpts = {}) {
    const options = { geojson: {}, chunkSize: 10000, ...inputOpts };
    const utf8Encoder = new utf8_encoder_1.Utf8ArrayBufferEncoder(options.chunkSize);
    if (!options.geojson.featureArray) {
        utf8Encoder.push('{\n', '"type": "FeatureCollection",\n', '"features":\n');
    }
    utf8Encoder.push('['); // Note no newline
    let geometryColumn = options.geojson.geometryColumn;
    let isFirstLine = true;
    for await (const batch of batchIterator) {
        const { table, start, end = (0, schema_1.getTableLength)(batch.table) - start } = batch;
        // Deduce geometry column if not already done
        if (!geometryColumn) {
            geometryColumn = geometryColumn || (0, encode_utils_1.detectGeometryColumnIndex)(table);
        }
        for (let rowIndex = start; rowIndex < end; ++rowIndex) {
            // Add a comma except on final feature
            if (!isFirstLine) {
                utf8Encoder.push(',');
            }
            utf8Encoder.push('\n');
            isFirstLine = false;
            encodeRow(table, rowIndex, geometryColumn, utf8Encoder);
            // eslint-disable-next-line max-depth
            if (utf8Encoder.isFull()) {
                yield utf8Encoder.getArrayBufferBatch();
            }
        }
        const arrayBufferBatch = utf8Encoder.getArrayBufferBatch();
        if (arrayBufferBatch.byteLength > 0) {
            yield arrayBufferBatch;
        }
    }
    utf8Encoder.push('\n');
    // Add completing rows and emit final batch
    utf8Encoder.push(']\n');
    if (!options.geojson.featureArray) {
        utf8Encoder.push('}');
    }
    // Note: Since we pushed a few final lines, the last batch will always exist, no need to check first
    yield utf8Encoder.getArrayBufferBatch();
}
exports.encodeTableAsGeojsonInBatches = encodeTableAsGeojsonInBatches;
// Helpers
/**
 * Encode a row. Currently this ignores properties in the geometry column.
 */
function encodeRow(table, rowIndex, geometryColumnIndex, utf8Encoder) {
    const row = (0, schema_2.getTableRowAsObject)(table, rowIndex);
    if (!row)
        return;
    const featureWithProperties = getFeatureFromRow(table, row, geometryColumnIndex);
    const featureString = JSON.stringify(featureWithProperties);
    utf8Encoder.push(featureString);
}
/**
 * Encode a row as a Feature. Currently this ignores properties objects in the geometry column.
 */
function getFeatureFromRow(table, row, geometryColumnIndex) {
    // Extract non-feature/geometry properties
    const properties = (0, encode_utils_1.getRowPropertyObject)(table, row, [geometryColumnIndex]);
    // Extract geometry feature
    const columnName = table.schema?.fields[geometryColumnIndex].name;
    let featureOrGeometry = columnName && row[columnName];
    // GeoJSON support null geometries
    if (!featureOrGeometry) {
        // @ts-ignore Feature type does not support null geometries
        return { type: 'Feature', geometry: null, properties };
    }
    // Support string geometries?
    // TODO: This assumes GeoJSON strings, which may not be the correct format
    // (could be WKT, encoded WKB...)
    if (typeof featureOrGeometry === 'string') {
        try {
            featureOrGeometry = JSON.parse(featureOrGeometry);
        }
        catch (err) {
            throw new Error('Invalid string geometry');
        }
    }
    if (typeof featureOrGeometry !== 'object' || typeof featureOrGeometry?.type !== 'string') {
        throw new Error('invalid geometry column value');
    }
    if (featureOrGeometry?.type === 'Feature') {
        // @ts-ignore Feature type does not support null geometries
        return { ...featureOrGeometry, properties };
    }
    // @ts-ignore Feature type does not support null geometries
    return { type: 'Feature', geometry: featureOrGeometry, properties };
}
