"use strict";
// loaders.gl, MIT license
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackGeoMetadata = exports.setGeoMetadata = exports.getGeoMetadata = exports.geoJSONSchema = exports._typecheckParquetLoader = exports.convertParquetToArrowSchema = exports.convertParquetSchema = exports.ParquetEncoder = exports.ParquetReader = exports.ParquetSchema = exports.preloadCompressions = exports.ParquetWasmWriter = exports._ParquetWriter = exports.ParquetWasmLoader = exports.ParquetColumnarLoader = exports.ParquetLoader = exports.ParquetWasmWorkerLoader = exports.ParquetWorkerLoader = void 0;
// ParquetLoader
const parquet_loader_1 = require("./parquet-loader");
Object.defineProperty(exports, "ParquetWorkerLoader", { enumerable: true, get: function () { return parquet_loader_1.ParquetLoader; } });
const parse_parquet_to_rows_1 = require("./lib/parsers/parse-parquet-to-rows");
const parse_parquet_to_columns_1 = require("./lib/parsers/parse-parquet-to-columns");
const parse_parquet_wasm_1 = require("./lib/wasm/parse-parquet-wasm");
const parquet_wasm_loader_1 = require("./parquet-wasm-loader");
Object.defineProperty(exports, "ParquetWasmWorkerLoader", { enumerable: true, get: function () { return parquet_wasm_loader_1.ParquetWasmLoader; } });
/** ParquetJS table loader */
exports.ParquetLoader = {
    ...parquet_loader_1.ParquetLoader,
    parse: parse_parquet_to_rows_1.parseParquet,
    parseFileInBatches: parse_parquet_to_rows_1.parseParquetFileInBatches
};
/** ParquetJS table loader */
// @ts-expect-error
exports.ParquetColumnarLoader = {
    ...parquet_loader_1.ParquetLoader,
    parse: parse_parquet_to_columns_1.parseParquetInColumns,
    parseFileInBatches: parse_parquet_to_columns_1.parseParquetFileInColumnarBatches
};
exports.ParquetWasmLoader = {
    ...parquet_wasm_loader_1.ParquetWasmLoader,
    parse: parse_parquet_wasm_1.parseParquetWasm
};
// ParquetWriter
var parquet_writer_1 = require("./parquet-writer");
Object.defineProperty(exports, "_ParquetWriter", { enumerable: true, get: function () { return parquet_writer_1.ParquetWriter; } });
var parquet_wasm_writer_1 = require("./parquet-wasm-writer");
Object.defineProperty(exports, "ParquetWasmWriter", { enumerable: true, get: function () { return parquet_wasm_writer_1.ParquetWasmWriter; } });
// EXPERIMENTAL - expose the internal parquetjs API
var compression_1 = require("./parquetjs/compression");
Object.defineProperty(exports, "preloadCompressions", { enumerable: true, get: function () { return compression_1.preloadCompressions; } });
var schema_1 = require("./parquetjs/schema/schema");
Object.defineProperty(exports, "ParquetSchema", { enumerable: true, get: function () { return schema_1.ParquetSchema; } });
var parquet_reader_1 = require("./parquetjs/parser/parquet-reader");
Object.defineProperty(exports, "ParquetReader", { enumerable: true, get: function () { return parquet_reader_1.ParquetReader; } });
var parquet_encoder_1 = require("./parquetjs/encoder/parquet-encoder");
Object.defineProperty(exports, "ParquetEncoder", { enumerable: true, get: function () { return parquet_encoder_1.ParquetEncoder; } });
var convert_schema_from_parquet_1 = require("./lib/arrow/convert-schema-from-parquet");
Object.defineProperty(exports, "convertParquetSchema", { enumerable: true, get: function () { return convert_schema_from_parquet_1.convertParquetSchema; } });
Object.defineProperty(exports, "convertParquetToArrowSchema", { enumerable: true, get: function () { return convert_schema_from_parquet_1.convertParquetSchema; } });
// TESTS
exports._typecheckParquetLoader = exports.ParquetLoader;
// Geo Metadata
var geoparquet_schema_1 = require("./lib/geo/geoparquet-schema");
Object.defineProperty(exports, "geoJSONSchema", { enumerable: true, get: function () { return __importDefault(geoparquet_schema_1).default; } });
var decode_geo_metadata_1 = require("./lib/geo/decode-geo-metadata");
Object.defineProperty(exports, "getGeoMetadata", { enumerable: true, get: function () { return decode_geo_metadata_1.getGeoMetadata; } });
Object.defineProperty(exports, "setGeoMetadata", { enumerable: true, get: function () { return decode_geo_metadata_1.setGeoMetadata; } });
Object.defineProperty(exports, "unpackGeoMetadata", { enumerable: true, get: function () { return decode_geo_metadata_1.unpackGeoMetadata; } });
