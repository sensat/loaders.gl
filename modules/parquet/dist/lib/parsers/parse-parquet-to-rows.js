"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseParquetFileInBatches = exports.parseParquet = void 0;
// import type {LoaderWithParser, Loader, LoaderOptions} from '@loaders.gl/loader-utils';
// import {ColumnarTableBatch} from '@loaders.gl/schema';
const loader_utils_1 = require("@loaders.gl/loader-utils");
const parquet_reader_1 = require("../../parquetjs/parser/parquet-reader");
async function parseParquet(arrayBuffer, options) {
    const blob = new Blob([arrayBuffer]);
    const rows = [];
    for await (const batch of parseParquetFileInBatches(blob, options)) {
        // we have only one input batch so return
        for (const row of batch.data) {
            rows.push(row);
        }
    }
    return {
        shape: 'object-row-table',
        // TODO - spread can fail for very large number of batches
        data: rows
    };
}
exports.parseParquet = parseParquet;
async function* parseParquetFileInBatches(blob, options) {
    const file = (0, loader_utils_1.makeReadableFile)(blob);
    const reader = new parquet_reader_1.ParquetReader(file);
    const rowBatches = reader.rowBatchIterator(options?.parquet);
    for await (const rows of rowBatches) {
        yield {
            shape: 'object-row-table',
            data: rows,
            batchType: 'data',
            length: rows.length
        };
    }
}
exports.parseParquetFileInBatches = parseParquetFileInBatches;
