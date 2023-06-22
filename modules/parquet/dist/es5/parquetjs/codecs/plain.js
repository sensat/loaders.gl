"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decodeValues = decodeValues;
exports.encodeValues = encodeValues;
var _int = _interopRequireDefault(require("int53"));
function encodeValues(type, values, opts) {
  switch (type) {
    case 'BOOLEAN':
      return encodeValues_BOOLEAN(values);
    case 'INT32':
      return encodeValues_INT32(values);
    case 'INT64':
      return encodeValues_INT64(values);
    case 'INT96':
      return encodeValues_INT96(values);
    case 'FLOAT':
      return encodeValues_FLOAT(values);
    case 'DOUBLE':
      return encodeValues_DOUBLE(values);
    case 'BYTE_ARRAY':
      return encodeValues_BYTE_ARRAY(values);
    case 'FIXED_LEN_BYTE_ARRAY':
      return encodeValues_FIXED_LEN_BYTE_ARRAY(values, opts);
    default:
      throw new Error("unsupported type: ".concat(type));
  }
}
function decodeValues(type, cursor, count, opts) {
  switch (type) {
    case 'BOOLEAN':
      return decodeValues_BOOLEAN(cursor, count);
    case 'INT32':
      return decodeValues_INT32(cursor, count);
    case 'INT64':
      return decodeValues_INT64(cursor, count);
    case 'INT96':
      return decodeValues_INT96(cursor, count);
    case 'FLOAT':
      return decodeValues_FLOAT(cursor, count);
    case 'DOUBLE':
      return decodeValues_DOUBLE(cursor, count);
    case 'BYTE_ARRAY':
      return decodeValues_BYTE_ARRAY(cursor, count);
    case 'FIXED_LEN_BYTE_ARRAY':
      return decodeValues_FIXED_LEN_BYTE_ARRAY(cursor, count, opts);
    default:
      throw new Error("unsupported type: ".concat(type));
  }
}
function encodeValues_BOOLEAN(values) {
  var buf = Buffer.alloc(Math.ceil(values.length / 8));
  buf.fill(0);
  for (var i = 0; i < values.length; i++) {
    if (values[i]) {
      buf[Math.floor(i / 8)] |= 1 << i % 8;
    }
  }
  return buf;
}
function decodeValues_BOOLEAN(cursor, count) {
  var values = [];
  for (var i = 0; i < count; i++) {
    var b = cursor.buffer[cursor.offset + Math.floor(i / 8)];
    values.push((b & 1 << i % 8) > 0);
  }
  cursor.offset += Math.ceil(count / 8);
  return values;
}
function encodeValues_INT32(values) {
  var buf = Buffer.alloc(4 * values.length);
  for (var i = 0; i < values.length; i++) {
    buf.writeInt32LE(values[i], i * 4);
  }
  return buf;
}
function decodeValues_INT32(cursor, count) {
  var values = [];
  for (var i = 0; i < count; i++) {
    values.push(cursor.buffer.readInt32LE(cursor.offset));
    cursor.offset += 4;
  }
  return values;
}
function encodeValues_INT64(values) {
  var buf = Buffer.alloc(8 * values.length);
  for (var i = 0; i < values.length; i++) {
    _int.default.writeInt64LE(values[i], buf, i * 8);
  }
  return buf;
}
function decodeValues_INT64(cursor, count) {
  var values = [];
  for (var i = 0; i < count; i++) {
    values.push(_int.default.readInt64LE(cursor.buffer, cursor.offset));
    cursor.offset += 8;
  }
  return values;
}
function encodeValues_INT96(values) {
  var buf = Buffer.alloc(12 * values.length);
  for (var i = 0; i < values.length; i++) {
    if (values[i] >= 0) {
      _int.default.writeInt64LE(values[i], buf, i * 12);
      buf.writeUInt32LE(0, i * 12 + 8);
    } else {
      _int.default.writeInt64LE(~-values[i] + 1, buf, i * 12);
      buf.writeUInt32LE(0xffffffff, i * 12 + 8);
    }
  }
  return buf;
}
function decodeValues_INT96(cursor, count) {
  var values = [];
  for (var i = 0; i < count; i++) {
    var low = _int.default.readInt64LE(cursor.buffer, cursor.offset);
    var high = cursor.buffer.readUInt32LE(cursor.offset + 8);
    if (high === 0xffffffff) {
      values.push(~-low + 1);
    } else {
      values.push(low);
    }
    cursor.offset += 12;
  }
  return values;
}
function encodeValues_FLOAT(values) {
  var buf = Buffer.alloc(4 * values.length);
  for (var i = 0; i < values.length; i++) {
    buf.writeFloatLE(values[i], i * 4);
  }
  return buf;
}
function decodeValues_FLOAT(cursor, count) {
  var values = [];
  for (var i = 0; i < count; i++) {
    values.push(cursor.buffer.readFloatLE(cursor.offset));
    cursor.offset += 4;
  }
  return values;
}
function encodeValues_DOUBLE(values) {
  var buf = Buffer.alloc(8 * values.length);
  for (var i = 0; i < values.length; i++) {
    buf.writeDoubleLE(values[i], i * 8);
  }
  return buf;
}
function decodeValues_DOUBLE(cursor, count) {
  var values = [];
  for (var i = 0; i < count; i++) {
    values.push(cursor.buffer.readDoubleLE(cursor.offset));
    cursor.offset += 8;
  }
  return values;
}
function encodeValues_BYTE_ARRAY(values) {
  var buf_len = 0;
  for (var i = 0; i < values.length; i++) {
    values[i] = Buffer.from(values[i]);
    buf_len += 4 + values[i].length;
  }
  var buf = Buffer.alloc(buf_len);
  var buf_pos = 0;
  for (var _i = 0; _i < values.length; _i++) {
    buf.writeUInt32LE(values[_i].length, buf_pos);
    values[_i].copy(buf, buf_pos + 4);
    buf_pos += 4 + values[_i].length;
  }
  return buf;
}
function decodeValues_BYTE_ARRAY(cursor, count) {
  var values = [];
  for (var i = 0; i < count; i++) {
    var len = cursor.buffer.readUInt32LE(cursor.offset);
    cursor.offset += 4;
    values.push(cursor.buffer.slice(cursor.offset, cursor.offset + len));
    cursor.offset += len;
  }
  return values;
}
function encodeValues_FIXED_LEN_BYTE_ARRAY(values, opts) {
  if (!opts.typeLength) {
    throw new Error('missing option: typeLength (required for FIXED_LEN_BYTE_ARRAY)');
  }
  for (var i = 0; i < values.length; i++) {
    values[i] = Buffer.from(values[i]);
    if (values[i].length !== opts.typeLength) {
      throw new Error("invalid value for FIXED_LEN_BYTE_ARRAY: ".concat(values[i]));
    }
  }
  return Buffer.concat(values);
}
function decodeValues_FIXED_LEN_BYTE_ARRAY(cursor, count, opts) {
  var values = [];
  if (!opts.typeLength) {
    throw new Error('missing option: typeLength (required for FIXED_LEN_BYTE_ARRAY)');
  }
  for (var i = 0; i < count; i++) {
    values.push(cursor.buffer.slice(cursor.offset, cursor.offset + opts.typeLength));
    cursor.offset += opts.typeLength;
  }
  return values;
}
//# sourceMappingURL=plain.js.map