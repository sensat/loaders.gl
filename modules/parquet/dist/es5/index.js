"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ParquetColumnarLoader = void 0;
Object.defineProperty(exports, "ParquetEncoder", {
  enumerable: true,
  get: function get() {
    return _parquetEncoder.ParquetEncoder;
  }
});
exports.ParquetLoader = void 0;
Object.defineProperty(exports, "ParquetReader", {
  enumerable: true,
  get: function get() {
    return _parquetReader.ParquetReader;
  }
});
Object.defineProperty(exports, "ParquetSchema", {
  enumerable: true,
  get: function get() {
    return _schema.ParquetSchema;
  }
});
exports.ParquetWasmLoader = void 0;
Object.defineProperty(exports, "ParquetWasmWorkerLoader", {
  enumerable: true,
  get: function get() {
    return _parquetWasmLoader.ParquetWasmLoader;
  }
});
Object.defineProperty(exports, "ParquetWasmWriter", {
  enumerable: true,
  get: function get() {
    return _parquetWasmWriter.ParquetWasmWriter;
  }
});
Object.defineProperty(exports, "ParquetWorkerLoader", {
  enumerable: true,
  get: function get() {
    return _parquetLoader.ParquetLoader;
  }
});
Object.defineProperty(exports, "_ParquetWriter", {
  enumerable: true,
  get: function get() {
    return _parquetWriter.ParquetWriter;
  }
});
exports._typecheckParquetLoader = void 0;
Object.defineProperty(exports, "convertParquetSchema", {
  enumerable: true,
  get: function get() {
    return _convertSchemaFromParquet.convertParquetSchema;
  }
});
Object.defineProperty(exports, "convertParquetToArrowSchema", {
  enumerable: true,
  get: function get() {
    return _convertSchemaFromParquet.convertParquetSchema;
  }
});
Object.defineProperty(exports, "geoJSONSchema", {
  enumerable: true,
  get: function get() {
    return _geoparquetSchema.default;
  }
});
Object.defineProperty(exports, "getGeoMetadata", {
  enumerable: true,
  get: function get() {
    return _decodeGeoMetadata.getGeoMetadata;
  }
});
Object.defineProperty(exports, "preloadCompressions", {
  enumerable: true,
  get: function get() {
    return _compression.preloadCompressions;
  }
});
Object.defineProperty(exports, "setGeoMetadata", {
  enumerable: true,
  get: function get() {
    return _decodeGeoMetadata.setGeoMetadata;
  }
});
Object.defineProperty(exports, "unpackGeoMetadata", {
  enumerable: true,
  get: function get() {
    return _decodeGeoMetadata.unpackGeoMetadata;
  }
});
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _parquetLoader = require("./parquet-loader");
var _parseParquetToRows = require("./lib/parsers/parse-parquet-to-rows");
var _parseParquetToColumns = require("./lib/parsers/parse-parquet-to-columns");
var _parseParquetWasm = require("./lib/wasm/parse-parquet-wasm");
var _parquetWasmLoader = require("./parquet-wasm-loader");
var _parquetWriter = require("./parquet-writer");
var _parquetWasmWriter = require("./parquet-wasm-writer");
var _compression = require("./parquetjs/compression");
var _schema = require("./parquetjs/schema/schema");
var _parquetReader = require("./parquetjs/parser/parquet-reader");
var _parquetEncoder = require("./parquetjs/encoder/parquet-encoder");
var _convertSchemaFromParquet = require("./lib/arrow/convert-schema-from-parquet");
var _geoparquetSchema = _interopRequireDefault(require("./lib/geo/geoparquet-schema"));
var _decodeGeoMetadata = require("./lib/geo/decode-geo-metadata");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var ParquetLoader = _objectSpread(_objectSpread({}, _parquetLoader.ParquetLoader), {}, {
  parse: _parseParquetToRows.parseParquet,
  parseFileInBatches: _parseParquetToRows.parseParquetFileInBatches
});
exports.ParquetLoader = ParquetLoader;
var ParquetColumnarLoader = _objectSpread(_objectSpread({}, _parquetLoader.ParquetLoader), {}, {
  parse: _parseParquetToColumns.parseParquetInColumns,
  parseFileInBatches: _parseParquetToColumns.parseParquetFileInColumnarBatches
});
exports.ParquetColumnarLoader = ParquetColumnarLoader;
var ParquetWasmLoader = _objectSpread(_objectSpread({}, _parquetWasmLoader.ParquetWasmLoader), {}, {
  parse: _parseParquetWasm.parseParquetWasm
});
exports.ParquetWasmLoader = ParquetWasmLoader;
var _typecheckParquetLoader = ParquetLoader;
exports._typecheckParquetLoader = _typecheckParquetLoader;
//# sourceMappingURL=index.js.map