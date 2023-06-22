"use strict";
// loaders.gl, MIT license
Object.defineProperty(exports, "__esModule", { value: true });
exports.deserializeArrowType = exports.serializeArrowType = exports.deserializeArrowField = exports.serializeArrowField = exports.deserializeArrowMetadata = exports.serializeArrowMetadata = exports.deserializeArrowSchema = exports.serializeArrowSchema = void 0;
const Arrow_dom_1 = require("apache-arrow/Arrow.dom");
function serializeArrowSchema(arrowSchema) {
    return {
        fields: arrowSchema.fields.map((arrowField) => serializeArrowField(arrowField)),
        metadata: serializeArrowMetadata(arrowSchema.metadata)
    };
}
exports.serializeArrowSchema = serializeArrowSchema;
function deserializeArrowSchema(schema) {
    return new Arrow_dom_1.Schema(schema.fields.map((field) => deserializeArrowField(field)), deserializeArrowMetadata(schema.metadata));
}
exports.deserializeArrowSchema = deserializeArrowSchema;
function serializeArrowMetadata(arrowMetadata) {
    return Object.fromEntries(arrowMetadata);
}
exports.serializeArrowMetadata = serializeArrowMetadata;
function deserializeArrowMetadata(metadata) {
    return metadata ? new Map(Object.entries(metadata)) : new Map();
}
exports.deserializeArrowMetadata = deserializeArrowMetadata;
function serializeArrowField(field) {
    return {
        name: field.name,
        type: serializeArrowType(field.type),
        nullable: field.nullable,
        metadata: serializeArrowMetadata(field.metadata)
    };
}
exports.serializeArrowField = serializeArrowField;
function deserializeArrowField(field) {
    return new Arrow_dom_1.Field(field.name, deserializeArrowType(field.type), field.nullable, deserializeArrowMetadata(field.metadata));
}
exports.deserializeArrowField = deserializeArrowField;
/** Converts a serializable loaders.gl data type to hydrated arrow data type */
// eslint-disable-next-line complexity
function serializeArrowType(arrowType) {
    switch (arrowType.constructor) {
        case Arrow_dom_1.Null:
            return 'null';
        case Arrow_dom_1.Binary:
            return 'binary';
        case Arrow_dom_1.Bool:
            return 'bool';
        // case Int: return 'int';
        case Arrow_dom_1.Int8:
            return 'int8';
        case Arrow_dom_1.Int16:
            return 'int16';
        case Arrow_dom_1.Int32:
            return 'int32';
        case Arrow_dom_1.Int64:
            return 'int64';
        case Arrow_dom_1.Uint8:
            return 'uint8';
        case Arrow_dom_1.Uint16:
            return 'uint16';
        case Arrow_dom_1.Uint32:
            return 'uint32';
        case Arrow_dom_1.Uint64:
            return 'uint64';
        // case Float: return 'float';
        case Arrow_dom_1.Float16:
            return 'float16';
        case Arrow_dom_1.Float32:
            return 'float32';
        case Arrow_dom_1.Float64:
            return 'float64';
        case Arrow_dom_1.Utf8:
            return 'utf8';
        // case Date: return 'date';
        case Arrow_dom_1.DateDay:
            return 'date-day';
        case Arrow_dom_1.DateMillisecond:
            return 'date-millisecond';
        // case Time: return 'time';
        case Arrow_dom_1.TimeMillisecond:
            return 'time-millisecond';
        case Arrow_dom_1.TimeSecond:
            return 'time-second';
        // case Timestamp: return 'timestamp';
        case Arrow_dom_1.TimestampSecond:
            return 'timestamp-second';
        case Arrow_dom_1.TimestampMillisecond:
            return 'timestamp-millisecond';
        case Arrow_dom_1.TimestampMicrosecond:
            return 'timestamp-microsecond';
        case Arrow_dom_1.TimestampNanosecond:
            return 'timestamp-nanosecond';
        // case Interval: return 'interval';
        case Arrow_dom_1.IntervalDayTime:
            return 'interval-daytime';
        case Arrow_dom_1.IntervalYearMonth:
            return 'interval-yearmonth';
        case Arrow_dom_1.FixedSizeList:
            return {
                type: 'fixed-size-list',
                listSize: arrowType.listSize,
                children: [serializeArrowField(arrowType.children[0])]
            };
        // case Struct:
        //   return {type: 'struct', children: (arrowType as Struct).children};
        default:
            throw new Error('array type not supported');
    }
}
exports.serializeArrowType = serializeArrowType;
/** Converts a serializable loaders.gl data type to hydrated arrow data type */
// eslint-disable-next-line complexity
function deserializeArrowType(dataType) {
    if (typeof dataType === 'object') {
        switch (dataType.type) {
            case 'fixed-size-list':
                const child = deserializeArrowField(dataType.children[0]);
                return new Arrow_dom_1.FixedSizeList(dataType.listSize, child);
            case 'struct':
                const children = dataType.children.map((arrowField) => deserializeArrowField(arrowField));
                return new Arrow_dom_1.Struct(children);
            default:
                throw new Error('array type not supported');
        }
    }
    switch (dataType) {
        case 'null':
            return new Arrow_dom_1.Null();
        case 'binary':
            return new Arrow_dom_1.Binary();
        case 'bool':
            return new Arrow_dom_1.Bool();
        // case 'int': return new Int();
        case 'int8':
            return new Arrow_dom_1.Int8();
        case 'int16':
            return new Arrow_dom_1.Int16();
        case 'int32':
            return new Arrow_dom_1.Int32();
        case 'int64':
            return new Arrow_dom_1.Int64();
        case 'uint8':
            return new Arrow_dom_1.Uint8();
        case 'uint16':
            return new Arrow_dom_1.Uint16();
        case 'uint32':
            return new Arrow_dom_1.Uint32();
        case 'uint64':
            return new Arrow_dom_1.Uint64();
        // case 'float': return new Float();
        case 'float16':
            return new Arrow_dom_1.Float16();
        case 'float32':
            return new Arrow_dom_1.Float32();
        case 'float64':
            return new Arrow_dom_1.Float64();
        case 'utf8':
            return new Arrow_dom_1.Utf8();
        // case 'date': return new Date();
        case 'date-day':
            return new Arrow_dom_1.DateDay();
        case 'date-millisecond':
            return new Arrow_dom_1.DateMillisecond();
        // case 'time': return new Time();
        case 'time-millisecond':
            return new Arrow_dom_1.TimeMillisecond();
        case 'time-second':
            return new Arrow_dom_1.TimeSecond();
        // case 'timestamp': return new Timestamp();
        case 'timestamp-second':
            return new Arrow_dom_1.TimestampSecond();
        case 'timestamp-millisecond':
            return new Arrow_dom_1.TimestampMillisecond();
        case 'timestamp-microsecond':
            return new Arrow_dom_1.TimestampMicrosecond();
        case 'timestamp-nanosecond':
            return new Arrow_dom_1.TimestampNanosecond();
        // case 'interval': return new Interval();
        case 'interval-daytime':
            return new Arrow_dom_1.IntervalDayTime();
        case 'interval-yearmonth':
            return new Arrow_dom_1.IntervalYearMonth();
        default:
            throw new Error('array type not supported');
    }
}
exports.deserializeArrowType = deserializeArrowType;
