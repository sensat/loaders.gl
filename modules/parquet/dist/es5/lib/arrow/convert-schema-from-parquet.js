"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PARQUET_TYPE_MAPPING = void 0;
exports.convertParquetSchema = convertParquetSchema;
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
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
function convertParquetSchema(parquetSchema, parquetMetadata) {
  var fields = getFields(parquetSchema.schema);
  var metadata = parquetMetadata && getSchemaMetadata(parquetMetadata);
  var schema = {
    fields: fields,
    metadata: metadata || {}
  };
  return schema;
}
function getFields(schema) {
  var fields = [];
  for (var name in schema) {
    var field = schema[name];
    if (field.fields) {
      var children = getFields(field.fields);
      fields.push({
        name: name,
        type: {
          type: 'struct',
          children: children
        },
        nullable: field.optional
      });
    } else {
      var type = PARQUET_TYPE_MAPPING[field.type];
      var metadata = getFieldMetadata(field);
      var arrowField = {
        name: name,
        type: type,
        nullable: field.optional,
        metadata: metadata
      };
      fields.push(arrowField);
    }
  }
  return fields;
}
function getFieldMetadata(field) {
  var metadata;
  for (var key in field) {
    if (key !== 'name') {
      var value = field[key] || '';
      value = typeof field[key] !== 'string' ? JSON.stringify(field[key]) : field[key];
      metadata = metadata || {};
      metadata[key] = value;
    }
  }
  return metadata;
}
function getSchemaMetadata(parquetMetadata) {
  var metadata;
  var keyValueList = parquetMetadata.key_value_metadata || [];
  var _iterator = _createForOfIteratorHelper(keyValueList),
    _step;
  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var _step$value = _step.value,
        key = _step$value.key,
        value = _step$value.value;
      if (typeof value === 'string') {
        metadata = metadata || {};
        metadata[key] = value;
      }
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }
  return metadata;
}
//# sourceMappingURL=convert-schema-from-parquet.js.map