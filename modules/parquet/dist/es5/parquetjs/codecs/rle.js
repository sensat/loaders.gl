"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeValues = decodeValues;
exports.encodeValues = encodeValues;
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _varint = _interopRequireDefault(require("varint"));
function encodeValues(type, values, opts) {
  if (!('bitWidth' in opts)) {
    throw new Error('bitWidth is required');
  }
  switch (type) {
    case 'BOOLEAN':
    case 'INT32':
    case 'INT64':
      values = values.map(function (x) {
        return parseInt(x, 10);
      });
      break;
    default:
      throw new Error("unsupported type: ".concat(type));
  }
  var buf = Buffer.alloc(0);
  var run = [];
  var repeats = 0;
  for (var i = 0; i < values.length; i++) {
    if (repeats === 0 && run.length % 8 === 0 && values[i] === values[i + 1]) {
      if (run.length) {
        buf = Buffer.concat([buf, encodeRunBitpacked(run, opts)]);
        run = [];
      }
      repeats = 1;
    } else if (repeats > 0 && values[i] === values[i - 1]) {
      repeats += 1;
    } else {
      if (repeats) {
        buf = Buffer.concat([buf, encodeRunRepeated(values[i - 1], repeats, opts)]);
        repeats = 0;
      }
      run.push(values[i]);
    }
  }
  if (repeats) {
    buf = Buffer.concat([buf, encodeRunRepeated(values[values.length - 1], repeats, opts)]);
  } else if (run.length) {
    buf = Buffer.concat([buf, encodeRunBitpacked(run, opts)]);
  }
  if (opts.disableEnvelope) {
    return buf;
  }
  var envelope = Buffer.alloc(buf.length + 4);
  envelope.writeUInt32LE(buf.length, undefined);
  buf.copy(envelope, 4);
  return envelope;
}
function decodeValues(type, cursor, count, opts) {
  if (!('bitWidth' in opts)) {
    throw new Error('bitWidth is required');
  }
  if (!opts.disableEnvelope) {
    cursor.offset += 4;
  }
  var values = [];
  while (values.length < count) {
    var header = _varint.default.decode(cursor.buffer, cursor.offset);
    cursor.offset += _varint.default.encodingLength(header);
    if (header & 1) {
      var _values;
      var _count = (header >> 1) * 8;
      (_values = values).push.apply(_values, (0, _toConsumableArray2.default)(decodeRunBitpacked(cursor, _count, opts)));
    } else {
      var _values2;
      var _count2 = header >> 1;
      (_values2 = values).push.apply(_values2, (0, _toConsumableArray2.default)(decodeRunRepeated(cursor, _count2, opts)));
    }
  }
  values = values.slice(0, count);
  if (values.length !== count) {
    throw new Error('invalid RLE encoding');
  }
  return values;
}
function decodeRunBitpacked(cursor, count, opts) {
  var bitWidth = opts.bitWidth;
  if (count % 8 !== 0) {
    throw new Error('must be a multiple of 8');
  }
  var values = new Array(count).fill(0);
  for (var b = 0; b < bitWidth * count; b++) {
    if (cursor.buffer[cursor.offset + Math.floor(b / 8)] & 1 << b % 8) {
      values[Math.floor(b / bitWidth)] |= 1 << b % bitWidth;
    }
  }
  cursor.offset += bitWidth * (count / 8);
  return values;
}
function decodeRunRepeated(cursor, count, opts) {
  var bitWidth = opts.bitWidth;
  var value = 0;
  for (var i = 0; i < Math.ceil(bitWidth / 8); i++) {
    value << 8;
    value += cursor.buffer[cursor.offset];
    cursor.offset += 1;
  }
  return new Array(count).fill(value);
}
function encodeRunBitpacked(values, opts) {
  var bitWidth = opts.bitWidth;
  for (var i = 0; i < values.length % 8; i++) {
    values.push(0);
  }
  var buf = Buffer.alloc(Math.ceil(bitWidth * (values.length / 8)));
  for (var b = 0; b < bitWidth * values.length; b++) {
    if ((values[Math.floor(b / bitWidth)] & 1 << b % bitWidth) > 0) {
      buf[Math.floor(b / 8)] |= 1 << b % 8;
    }
  }
  return Buffer.concat([Buffer.from(_varint.default.encode(values.length / 8 << 1 | 1)), buf]);
}
function encodeRunRepeated(value, count, opts) {
  var bitWidth = opts.bitWidth;
  var buf = Buffer.alloc(Math.ceil(bitWidth / 8));
  for (var i = 0; i < buf.length; i++) {
    buf.writeUInt8(value & 0xff, i);
    value >> 8;
  }
  return Buffer.concat([Buffer.from(_varint.default.encode(count << 1)), buf]);
}
//# sourceMappingURL=rle.js.map