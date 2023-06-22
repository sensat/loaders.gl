import { Field as ArrowField, Schema as ArrowSchema, Null, Binary, Bool, Int8, Int16, Int32, Int64, Uint8, Uint16, Uint32, Uint64, Float16, Float32, Float64, Utf8, DateDay, DateMillisecond, TimeMillisecond, TimeSecond, TimestampSecond, TimestampMillisecond, TimestampMicrosecond, TimestampNanosecond, IntervalDayTime, IntervalYearMonth, FixedSizeList, Struct } from 'apache-arrow/Arrow.dom';
export function serializeArrowSchema(arrowSchema) {
  return {
    fields: arrowSchema.fields.map(arrowField => serializeArrowField(arrowField)),
    metadata: serializeArrowMetadata(arrowSchema.metadata)
  };
}
export function deserializeArrowSchema(schema) {
  return new ArrowSchema(schema.fields.map(field => deserializeArrowField(field)), deserializeArrowMetadata(schema.metadata));
}
export function serializeArrowMetadata(arrowMetadata) {
  return Object.fromEntries(arrowMetadata);
}
export function deserializeArrowMetadata(metadata) {
  return metadata ? new Map(Object.entries(metadata)) : new Map();
}
export function serializeArrowField(field) {
  return {
    name: field.name,
    type: serializeArrowType(field.type),
    nullable: field.nullable,
    metadata: serializeArrowMetadata(field.metadata)
  };
}
export function deserializeArrowField(field) {
  return new ArrowField(field.name, deserializeArrowType(field.type), field.nullable, deserializeArrowMetadata(field.metadata));
}
export function serializeArrowType(arrowType) {
  switch (arrowType.constructor) {
    case Null:
      return 'null';
    case Binary:
      return 'binary';
    case Bool:
      return 'bool';
    case Int8:
      return 'int8';
    case Int16:
      return 'int16';
    case Int32:
      return 'int32';
    case Int64:
      return 'int64';
    case Uint8:
      return 'uint8';
    case Uint16:
      return 'uint16';
    case Uint32:
      return 'uint32';
    case Uint64:
      return 'uint64';
    case Float16:
      return 'float16';
    case Float32:
      return 'float32';
    case Float64:
      return 'float64';
    case Utf8:
      return 'utf8';
    case DateDay:
      return 'date-day';
    case DateMillisecond:
      return 'date-millisecond';
    case TimeMillisecond:
      return 'time-millisecond';
    case TimeSecond:
      return 'time-second';
    case TimestampSecond:
      return 'timestamp-second';
    case TimestampMillisecond:
      return 'timestamp-millisecond';
    case TimestampMicrosecond:
      return 'timestamp-microsecond';
    case TimestampNanosecond:
      return 'timestamp-nanosecond';
    case IntervalDayTime:
      return 'interval-daytime';
    case IntervalYearMonth:
      return 'interval-yearmonth';
    case FixedSizeList:
      return {
        type: 'fixed-size-list',
        listSize: arrowType.listSize,
        children: [serializeArrowField(arrowType.children[0])]
      };
    default:
      throw new Error('array type not supported');
  }
}
export function deserializeArrowType(dataType) {
  if (typeof dataType === 'object') {
    switch (dataType.type) {
      case 'fixed-size-list':
        const child = deserializeArrowField(dataType.children[0]);
        return new FixedSizeList(dataType.listSize, child);
      case 'struct':
        const children = dataType.children.map(arrowField => deserializeArrowField(arrowField));
        return new Struct(children);
      default:
        throw new Error('array type not supported');
    }
  }
  switch (dataType) {
    case 'null':
      return new Null();
    case 'binary':
      return new Binary();
    case 'bool':
      return new Bool();
    case 'int8':
      return new Int8();
    case 'int16':
      return new Int16();
    case 'int32':
      return new Int32();
    case 'int64':
      return new Int64();
    case 'uint8':
      return new Uint8();
    case 'uint16':
      return new Uint16();
    case 'uint32':
      return new Uint32();
    case 'uint64':
      return new Uint64();
    case 'float16':
      return new Float16();
    case 'float32':
      return new Float32();
    case 'float64':
      return new Float64();
    case 'utf8':
      return new Utf8();
    case 'date-day':
      return new DateDay();
    case 'date-millisecond':
      return new DateMillisecond();
    case 'time-millisecond':
      return new TimeMillisecond();
    case 'time-second':
      return new TimeSecond();
    case 'timestamp-second':
      return new TimestampSecond();
    case 'timestamp-millisecond':
      return new TimestampMillisecond();
    case 'timestamp-microsecond':
      return new TimestampMicrosecond();
    case 'timestamp-nanosecond':
      return new TimestampNanosecond();
    case 'interval-daytime':
      return new IntervalDayTime();
    case 'interval-yearmonth':
      return new IntervalYearMonth();
    default:
      throw new Error('array type not supported');
  }
}
//# sourceMappingURL=convert-schema-arrow.js.map