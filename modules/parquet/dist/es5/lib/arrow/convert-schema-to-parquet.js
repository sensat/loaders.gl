"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PARQUET_TYPE_MAPPING = void 0;
exports.convertToParquetSchema = convertToParquetSchema;
var PARQUET_TYPE_MAPPING = {
  BOOLEAN: 'bool',
  INT32: 'int32',
  INT64: 'float64',
  INT96: 'float64',
  FLOAT: 'float32',
  DOUBLE: 'float64',
  BYTE_ARRAY: 'binary',
  FIXED_LEN_BYTE_ARRAY: 'binary',
  UTF8: 'utf8',
  DATE: 'int32',
  TIME_MILLIS: 'int64',
  TIME_MICROS: 'int64',
  TIMESTAMP_MILLIS: 'int64',
  TIMESTAMP_MICROS: 'int64',
  UINT_8: 'int32',
  UINT_16: 'uint16',
  UINT_32: 'uint32',
  UINT_64: 'uint64',
  INT_8: 'int8',
  INT_16: 'int16',
  INT_32: 'int32',
  INT_64: 'int64',
  JSON: 'binary',
  BSON: 'binary',
  INTERVAL: 'binary',
  DECIMAL_INT32: 'float32',
  DECIMAL_INT64: 'float64',
  DECIMAL_BYTE_ARRAY: 'float64',
  DECIMAL_FIXED_LEN_BYTE_ARRAY: 'float64'
};
exports.PARQUET_TYPE_MAPPING = PARQUET_TYPE_MAPPING;
function convertToParquetSchema(schema) {
  var fields = [];
  return {
    fields: fields,
    metadata: {}
  };
}
//# sourceMappingURL=convert-schema-to-parquet.js.map