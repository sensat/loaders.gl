"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseParquetFileInColumnarBatches = exports.parseParquetInColumns = void 0;
const loader_utils_1 = require("@loaders.gl/loader-utils");
const parquet_reader_1 = require("../../parquetjs/parser/parquet-reader");
const convert_schema_from_parquet_1 = require("../arrow/convert-schema-from-parquet");
const shred_1 = require("../../parquetjs/schema/shred");
// import {convertParquetRowGroupToColumns} from '../arrow/convert-row-group-to-columns.js';
const decode_geo_metadata_1 = require("../geo/decode-geo-metadata");
async function parseParquetInColumns(arrayBuffer, options) {
    const blob = new Blob([arrayBuffer]);
    for await (const batch of parseParquetFileInColumnarBatches(blob, options)) {
        return {
            shape: 'columnar-table',
            schema: batch.schema,
            data: batch.data
        };
    }
    throw new Error('empty table');
}
exports.parseParquetInColumns = parseParquetInColumns;
async function* parseParquetFileInColumnarBatches(blob, options) {
    const file = (0, loader_utils_1.makeReadableFile)(blob);
    const reader = new parquet_reader_1.ParquetReader(file);
    const parquetSchema = await reader.getSchema();
    const parquetMetadata = await reader.getFileMetadata();
    const schema = (0, convert_schema_from_parquet_1.convertParquetSchema)(parquetSchema, parquetMetadata);
    (0, decode_geo_metadata_1.unpackGeoMetadata)(schema);
    const rowGroups = reader.rowGroupIterator(options?.parquet);
    for await (const rowGroup of rowGroups) {
        yield convertRowGroupToTableBatch(parquetSchema, rowGroup, schema);
    }
}
exports.parseParquetFileInColumnarBatches = parseParquetFileInColumnarBatches;
function convertRowGroupToTableBatch(parquetSchema, rowGroup, schema) {
    // const data = convertParquetRowGroupToColumns(schema, rowGroup);
    const data = (0, shred_1.materializeColumns)(parquetSchema, rowGroup);
    return {
        shape: 'columnar-table',
        batchType: 'data',
        schema,
        data,
        length: rowGroup.rowCount
    };
}
