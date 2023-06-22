"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deserializeArrowField = deserializeArrowField;
exports.deserializeArrowMetadata = deserializeArrowMetadata;
exports.deserializeArrowSchema = deserializeArrowSchema;
exports.deserializeArrowType = deserializeArrowType;
exports.serializeArrowField = serializeArrowField;
exports.serializeArrowMetadata = serializeArrowMetadata;
exports.serializeArrowSchema = serializeArrowSchema;
exports.serializeArrowType = serializeArrowType;
var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));
var _Arrow = require("apache-arrow/Arrow.dom");
function serializeArrowSchema(arrowSchema) {
  return {
    fields: arrowSchema.fields.map(function (arrowField) {
      return serializeArrowField(arrowField);
    }),
    metadata: serializeArrowMetadata(arrowSchema.metadata)
  };
}
function deserializeArrowSchema(schema) {
  return new _Arrow.Schema(schema.fields.map(function (field) {
    return deserializeArrowField(field);
  }), deserializeArrowMetadata(schema.metadata));
}
function serializeArrowMetadata(arrowMetadata) {
  return Object.fromEntries(arrowMetadata);
}
function deserializeArrowMetadata(metadata) {
  return metadata ? new Map(Object.entries(metadata)) : new Map();
}
function serializeArrowField(field) {
  return {
    name: field.name,
    type: serializeArrowType(field.type),
    nullable: field.nullable,
    metadata: serializeArrowMetadata(field.metadata)
  };
}
function deserializeArrowField(field) {
  return new _Arrow.Field(field.name, deserializeArrowType(field.type), field.nullable, deserializeArrowMetadata(field.metadata));
}
function serializeArrowType(arrowType) {
  switch (arrowType.constructor) {
    case _Arrow.Null:
      return 'null';
    case _Arrow.Binary:
      return 'binary';
    case _Arrow.Bool:
      return 'bool';
    case _Arrow.Int8:
      return 'int8';
    case _Arrow.Int16:
      return 'int16';
    case _Arrow.Int32:
      return 'int32';
    case _Arrow.Int64:
      return 'int64';
    case _Arrow.Uint8:
      return 'uint8';
    case _Arrow.Uint16:
      return 'uint16';
    case _Arrow.Uint32:
      return 'uint32';
    case _Arrow.Uint64:
      return 'uint64';
    case _Arrow.Float16:
      return 'float16';
    case _Arrow.Float32:
      return 'float32';
    case _Arrow.Float64:
      return 'float64';
    case _Arrow.Utf8:
      return 'utf8';
    case _Arrow.DateDay:
      return 'date-day';
    case _Arrow.DateMillisecond:
      return 'date-millisecond';
    case _Arrow.TimeMillisecond:
      return 'time-millisecond';
    case _Arrow.TimeSecond:
      return 'time-second';
    case _Arrow.TimestampSecond:
      return 'timestamp-second';
    case _Arrow.TimestampMillisecond:
      return 'timestamp-millisecond';
    case _Arrow.TimestampMicrosecond:
      return 'timestamp-microsecond';
    case _Arrow.TimestampNanosecond:
      return 'timestamp-nanosecond';
    case _Arrow.IntervalDayTime:
      return 'interval-daytime';
    case _Arrow.IntervalYearMonth:
      return 'interval-yearmonth';
    case _Arrow.FixedSizeList:
      return {
        type: 'fixed-size-list',
        listSize: arrowType.listSize,
        children: [serializeArrowField(arrowType.children[0])]
      };
    default:
      throw new Error('array type not supported');
  }
}
function deserializeArrowType(dataType) {
  if ((0, _typeof2.default)(dataType) === 'object') {
    switch (dataType.type) {
      case 'fixed-size-list':
        var child = deserializeArrowField(dataType.children[0]);
        return new _Arrow.FixedSizeList(dataType.listSize, child);
      case 'struct':
        var children = dataType.children.map(function (arrowField) {
          return deserializeArrowField(arrowField);
        });
        return new _Arrow.Struct(children);
      default:
        throw new Error('array type not supported');
    }
  }
  switch (dataType) {
    case 'null':
      return new _Arrow.Null();
    case 'binary':
      return new _Arrow.Binary();
    case 'bool':
      return new _Arrow.Bool();
    case 'int8':
      return new _Arrow.Int8();
    case 'int16':
      return new _Arrow.Int16();
    case 'int32':
      return new _Arrow.Int32();
    case 'int64':
      return new _Arrow.Int64();
    case 'uint8':
      return new _Arrow.Uint8();
    case 'uint16':
      return new _Arrow.Uint16();
    case 'uint32':
      return new _Arrow.Uint32();
    case 'uint64':
      return new _Arrow.Uint64();
    case 'float16':
      return new _Arrow.Float16();
    case 'float32':
      return new _Arrow.Float32();
    case 'float64':
      return new _Arrow.Float64();
    case 'utf8':
      return new _Arrow.Utf8();
    case 'date-day':
      return new _Arrow.DateDay();
    case 'date-millisecond':
      return new _Arrow.DateMillisecond();
    case 'time-millisecond':
      return new _Arrow.TimeMillisecond();
    case 'time-second':
      return new _Arrow.TimeSecond();
    case 'timestamp-second':
      return new _Arrow.TimestampSecond();
    case 'timestamp-millisecond':
      return new _Arrow.TimestampMillisecond();
    case 'timestamp-microsecond':
      return new _Arrow.TimestampMicrosecond();
    case 'timestamp-nanosecond':
      return new _Arrow.TimestampNanosecond();
    case 'interval-daytime':
      return new _Arrow.IntervalDayTime();
    case 'interval-yearmonth':
      return new _Arrow.IntervalYearMonth();
    default:
      throw new Error('array type not supported');
  }
}
//# sourceMappingURL=convert-schema-arrow.js.map