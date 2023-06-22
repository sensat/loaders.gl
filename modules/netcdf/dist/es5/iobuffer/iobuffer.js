"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IOBuffer = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var DEFAULT_BYTE_LENGTH = 1024 * 8;
var IOBuffer = function () {
  function IOBuffer() {
    var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_BYTE_LENGTH;
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck2.default)(this, IOBuffer);
    (0, _defineProperty2.default)(this, "buffer", void 0);
    (0, _defineProperty2.default)(this, "byteLength", void 0);
    (0, _defineProperty2.default)(this, "byteOffset", void 0);
    (0, _defineProperty2.default)(this, "length", void 0);
    (0, _defineProperty2.default)(this, "offset", void 0);
    (0, _defineProperty2.default)(this, "lastWrittenByte", void 0);
    (0, _defineProperty2.default)(this, "littleEndian", void 0);
    (0, _defineProperty2.default)(this, "_data", void 0);
    (0, _defineProperty2.default)(this, "_mark", void 0);
    (0, _defineProperty2.default)(this, "_marks", void 0);
    (0, _defineProperty2.default)(this, "textDecoder", new TextDecoder());
    (0, _defineProperty2.default)(this, "textEncoder", new TextEncoder());
    var dataIsGiven = false;
    if (typeof data === 'number') {
      data = new ArrayBuffer(data);
    } else {
      dataIsGiven = true;
      this.lastWrittenByte = data.byteLength;
    }
    var offset = options.offset ? options.offset >>> 0 : 0;
    var byteLength = data.byteLength - offset;
    var dvOffset = offset;
    if (ArrayBuffer.isView(data) || data instanceof IOBuffer) {
      if (data.byteLength !== data.buffer.byteLength) {
        dvOffset = data.byteOffset + offset;
      }
      data = data.buffer;
    }
    if (dataIsGiven) {
      this.lastWrittenByte = byteLength;
    } else {
      this.lastWrittenByte = 0;
    }
    this.buffer = data;
    this.length = byteLength;
    this.byteLength = byteLength;
    this.byteOffset = dvOffset;
    this.offset = 0;
    this.littleEndian = true;
    this._data = new DataView(this.buffer, dvOffset, byteLength);
    this._mark = 0;
    this._marks = [];
  }
  (0, _createClass2.default)(IOBuffer, [{
    key: "available",
    value: function available() {
      var byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.offset + byteLength <= this.length;
    }
  }, {
    key: "isLittleEndian",
    value: function isLittleEndian() {
      return this.littleEndian;
    }
  }, {
    key: "setLittleEndian",
    value: function setLittleEndian() {
      this.littleEndian = true;
      return this;
    }
  }, {
    key: "isBigEndian",
    value: function isBigEndian() {
      return !this.littleEndian;
    }
  }, {
    key: "setBigEndian",
    value: function setBigEndian() {
      this.littleEndian = false;
      return this;
    }
  }, {
    key: "skip",
    value: function skip() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      this.offset += n;
      return this;
    }
  }, {
    key: "seek",
    value: function seek(offset) {
      this.offset = offset;
      return this;
    }
  }, {
    key: "mark",
    value: function mark() {
      this._mark = this.offset;
      return this;
    }
  }, {
    key: "reset",
    value: function reset() {
      this.offset = this._mark;
      return this;
    }
  }, {
    key: "pushMark",
    value: function pushMark() {
      this._marks.push(this.offset);
      return this;
    }
  }, {
    key: "popMark",
    value: function popMark() {
      var offset = this._marks.pop();
      if (offset === undefined) {
        throw new Error('Mark stack empty');
      }
      this.seek(offset);
      return this;
    }
  }, {
    key: "rewind",
    value: function rewind() {
      this.offset = 0;
      return this;
    }
  }, {
    key: "ensureAvailable",
    value: function ensureAvailable() {
      var byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      if (!this.available(byteLength)) {
        var lengthNeeded = this.offset + byteLength;
        var newLength = lengthNeeded * 2;
        var newArray = new Uint8Array(newLength);
        newArray.set(new Uint8Array(this.buffer));
        this.buffer = newArray.buffer;
        this.length = this.byteLength = newLength;
        this._data = new DataView(this.buffer);
      }
      return this;
    }
  }, {
    key: "readBoolean",
    value: function readBoolean() {
      return this.readUint8() !== 0;
    }
  }, {
    key: "readInt8",
    value: function readInt8() {
      return this._data.getInt8(this.offset++);
    }
  }, {
    key: "readUint8",
    value: function readUint8() {
      return this._data.getUint8(this.offset++);
    }
  }, {
    key: "readByte",
    value: function readByte() {
      return this.readUint8();
    }
  }, {
    key: "readBytes",
    value: function readBytes() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var bytes = new Uint8Array(n);
      for (var i = 0; i < n; i++) {
        bytes[i] = this.readByte();
      }
      return bytes;
    }
  }, {
    key: "readInt16",
    value: function readInt16() {
      var value = this._data.getInt16(this.offset, this.littleEndian);
      this.offset += 2;
      return value;
    }
  }, {
    key: "readUint16",
    value: function readUint16() {
      var value = this._data.getUint16(this.offset, this.littleEndian);
      this.offset += 2;
      return value;
    }
  }, {
    key: "readInt32",
    value: function readInt32() {
      var value = this._data.getInt32(this.offset, this.littleEndian);
      this.offset += 4;
      return value;
    }
  }, {
    key: "readUint32",
    value: function readUint32() {
      var value = this._data.getUint32(this.offset, this.littleEndian);
      this.offset += 4;
      return value;
    }
  }, {
    key: "readFloat32",
    value: function readFloat32() {
      var value = this._data.getFloat32(this.offset, this.littleEndian);
      this.offset += 4;
      return value;
    }
  }, {
    key: "readFloat64",
    value: function readFloat64() {
      var value = this._data.getFloat64(this.offset, this.littleEndian);
      this.offset += 8;
      return value;
    }
  }, {
    key: "readChar",
    value: function readChar() {
      return String.fromCharCode(this.readInt8());
    }
  }, {
    key: "readChars",
    value: function readChars() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      var result = '';
      for (var i = 0; i < n; i++) {
        result += this.readChar();
      }
      return result;
    }
  }, {
    key: "readUtf8",
    value: function readUtf8() {
      var n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
      return this.textDecoder.decode(this.readBytes(n));
    }
  }, {
    key: "writeBoolean",
    value: function writeBoolean(value) {
      this.writeUint8(value ? 0xff : 0x00);
      return this;
    }
  }, {
    key: "writeInt8",
    value: function writeInt8(value) {
      this.ensureAvailable(1);
      this._data.setInt8(this.offset++, value);
      this._updateLastWrittenByte();
      return this;
    }
  }, {
    key: "writeUint8",
    value: function writeUint8(value) {
      this.ensureAvailable(1);
      this._data.setUint8(this.offset++, value);
      this._updateLastWrittenByte();
      return this;
    }
  }, {
    key: "writeByte",
    value: function writeByte(value) {
      return this.writeUint8(value);
    }
  }, {
    key: "writeBytes",
    value: function writeBytes(bytes) {
      this.ensureAvailable(bytes.length);
      for (var i = 0; i < bytes.length; i++) {
        this._data.setUint8(this.offset++, bytes[i]);
      }
      this._updateLastWrittenByte();
      return this;
    }
  }, {
    key: "writeInt16",
    value: function writeInt16(value) {
      this.ensureAvailable(2);
      this._data.setInt16(this.offset, value, this.littleEndian);
      this.offset += 2;
      this._updateLastWrittenByte();
      return this;
    }
  }, {
    key: "writeUint16",
    value: function writeUint16(value) {
      this.ensureAvailable(2);
      this._data.setUint16(this.offset, value, this.littleEndian);
      this.offset += 2;
      this._updateLastWrittenByte();
      return this;
    }
  }, {
    key: "writeInt32",
    value: function writeInt32(value) {
      this.ensureAvailable(4);
      this._data.setInt32(this.offset, value, this.littleEndian);
      this.offset += 4;
      this._updateLastWrittenByte();
      return this;
    }
  }, {
    key: "writeUint32",
    value: function writeUint32(value) {
      this.ensureAvailable(4);
      this._data.setUint32(this.offset, value, this.littleEndian);
      this.offset += 4;
      this._updateLastWrittenByte();
      return this;
    }
  }, {
    key: "writeFloat32",
    value: function writeFloat32(value) {
      this.ensureAvailable(4);
      this._data.setFloat32(this.offset, value, this.littleEndian);
      this.offset += 4;
      this._updateLastWrittenByte();
      return this;
    }
  }, {
    key: "writeFloat64",
    value: function writeFloat64(value) {
      this.ensureAvailable(8);
      this._data.setFloat64(this.offset, value, this.littleEndian);
      this.offset += 8;
      this._updateLastWrittenByte();
      return this;
    }
  }, {
    key: "writeChar",
    value: function writeChar(str) {
      return this.writeUint8(str.charCodeAt(0));
    }
  }, {
    key: "writeChars",
    value: function writeChars(str) {
      for (var i = 0; i < str.length; i++) {
        this.writeUint8(str.charCodeAt(i));
      }
      return this;
    }
  }, {
    key: "writeUtf8",
    value: function writeUtf8(str) {
      var bytes = this.textEncoder.encode(str);
      return this.writeBytes(bytes);
    }
  }, {
    key: "toArray",
    value: function toArray() {
      return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte);
    }
  }, {
    key: "_updateLastWrittenByte",
    value: function _updateLastWrittenByte() {
      if (this.offset > this.lastWrittenByte) {
        this.lastWrittenByte = this.offset;
      }
    }
  }]);
  return IOBuffer;
}();
exports.IOBuffer = IOBuffer;
//# sourceMappingURL=iobuffer.js.map