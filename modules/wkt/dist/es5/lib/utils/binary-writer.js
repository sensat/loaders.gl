"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var LE = true;
var BE = false;
var BinaryWriter = function () {
  function BinaryWriter(size, allowResize) {
    (0, _classCallCheck2.default)(this, BinaryWriter);
    (0, _defineProperty2.default)(this, "arrayBuffer", void 0);
    (0, _defineProperty2.default)(this, "dataView", void 0);
    (0, _defineProperty2.default)(this, "byteOffset", 0);
    (0, _defineProperty2.default)(this, "allowResize", false);
    this.arrayBuffer = new ArrayBuffer(size);
    this.dataView = new DataView(this.arrayBuffer);
    this.byteOffset = 0;
    this.allowResize = allowResize || false;
  }
  (0, _createClass2.default)(BinaryWriter, [{
    key: "writeUInt8",
    value: function writeUInt8(value) {
      this._ensureSize(1);
      this.dataView.setUint8(this.byteOffset, value);
      this.byteOffset += 1;
    }
  }, {
    key: "writeUInt16LE",
    value: function writeUInt16LE(value) {
      this._ensureSize(2);
      this.dataView.setUint16(this.byteOffset, value, LE);
      this.byteOffset += 2;
    }
  }, {
    key: "writeUInt16BE",
    value: function writeUInt16BE(value) {
      this._ensureSize(2);
      this.dataView.setUint16(this.byteOffset, value, BE);
      this.byteOffset += 2;
    }
  }, {
    key: "writeUInt32LE",
    value: function writeUInt32LE(value) {
      this._ensureSize(4);
      this.dataView.setUint32(this.byteOffset, value, LE);
      this.byteOffset += 4;
    }
  }, {
    key: "writeUInt32BE",
    value: function writeUInt32BE(value) {
      this._ensureSize(4);
      this.dataView.setUint32(this.byteOffset, value, BE);
      this.byteOffset += 4;
    }
  }, {
    key: "writeInt8",
    value: function writeInt8(value) {
      this._ensureSize(1);
      this.dataView.setInt8(this.byteOffset, value);
      this.byteOffset += 1;
    }
  }, {
    key: "writeInt16LE",
    value: function writeInt16LE(value) {
      this._ensureSize(2);
      this.dataView.setInt16(this.byteOffset, value, LE);
      this.byteOffset += 2;
    }
  }, {
    key: "writeInt16BE",
    value: function writeInt16BE(value) {
      this._ensureSize(2);
      this.dataView.setInt16(this.byteOffset, value, BE);
      this.byteOffset += 2;
    }
  }, {
    key: "writeInt32LE",
    value: function writeInt32LE(value) {
      this._ensureSize(4);
      this.dataView.setInt32(this.byteOffset, value, LE);
      this.byteOffset += 4;
    }
  }, {
    key: "writeInt32BE",
    value: function writeInt32BE(value) {
      this._ensureSize(4);
      this.dataView.setInt32(this.byteOffset, value, BE);
      this.byteOffset += 4;
    }
  }, {
    key: "writeFloatLE",
    value: function writeFloatLE(value) {
      this._ensureSize(4);
      this.dataView.setFloat32(this.byteOffset, value, LE);
      this.byteOffset += 4;
    }
  }, {
    key: "writeFloatBE",
    value: function writeFloatBE(value) {
      this._ensureSize(4);
      this.dataView.setFloat32(this.byteOffset, value, BE);
      this.byteOffset += 4;
    }
  }, {
    key: "writeDoubleLE",
    value: function writeDoubleLE(value) {
      this._ensureSize(8);
      this.dataView.setFloat64(this.byteOffset, value, LE);
      this.byteOffset += 8;
    }
  }, {
    key: "writeDoubleBE",
    value: function writeDoubleBE(value) {
      this._ensureSize(8);
      this.dataView.setFloat64(this.byteOffset, value, BE);
      this.byteOffset += 8;
    }
  }, {
    key: "writeVarInt",
    value: function writeVarInt(value) {
      var length = 1;
      while ((value & 0xffffff80) !== 0) {
        this.writeUInt8(value & 0x7f | 0x80);
        value >>>= 7;
        length++;
      }
      this.writeUInt8(value & 0x7f);
      return length;
    }
  }, {
    key: "writeBuffer",
    value: function writeBuffer(arrayBuffer) {
      this._ensureSize(arrayBuffer.byteLength);
      var tempArray = new Uint8Array(this.arrayBuffer);
      tempArray.set(new Uint8Array(arrayBuffer), this.byteOffset);
      this.byteOffset += arrayBuffer.byteLength;
    }
  }, {
    key: "_ensureSize",
    value: function _ensureSize(size) {
      if (this.arrayBuffer.byteLength < this.byteOffset + size) {
        if (this.allowResize) {
          var newArrayBuffer = new ArrayBuffer(this.byteOffset + size);
          var tempArray = new Uint8Array(newArrayBuffer);
          tempArray.set(new Uint8Array(this.arrayBuffer));
          this.arrayBuffer = newArrayBuffer;
        } else {
          throw new Error('BinaryWriter overflow');
        }
      }
    }
  }]);
  return BinaryWriter;
}();
exports.default = BinaryWriter;
//# sourceMappingURL=binary-writer.js.map