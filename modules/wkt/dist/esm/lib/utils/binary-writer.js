import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
const LE = true;
const BE = false;
export default class BinaryWriter {
  constructor(size, allowResize) {
    _defineProperty(this, "arrayBuffer", void 0);
    _defineProperty(this, "dataView", void 0);
    _defineProperty(this, "byteOffset", 0);
    _defineProperty(this, "allowResize", false);
    this.arrayBuffer = new ArrayBuffer(size);
    this.dataView = new DataView(this.arrayBuffer);
    this.byteOffset = 0;
    this.allowResize = allowResize || false;
  }
  writeUInt8(value) {
    this._ensureSize(1);
    this.dataView.setUint8(this.byteOffset, value);
    this.byteOffset += 1;
  }
  writeUInt16LE(value) {
    this._ensureSize(2);
    this.dataView.setUint16(this.byteOffset, value, LE);
    this.byteOffset += 2;
  }
  writeUInt16BE(value) {
    this._ensureSize(2);
    this.dataView.setUint16(this.byteOffset, value, BE);
    this.byteOffset += 2;
  }
  writeUInt32LE(value) {
    this._ensureSize(4);
    this.dataView.setUint32(this.byteOffset, value, LE);
    this.byteOffset += 4;
  }
  writeUInt32BE(value) {
    this._ensureSize(4);
    this.dataView.setUint32(this.byteOffset, value, BE);
    this.byteOffset += 4;
  }
  writeInt8(value) {
    this._ensureSize(1);
    this.dataView.setInt8(this.byteOffset, value);
    this.byteOffset += 1;
  }
  writeInt16LE(value) {
    this._ensureSize(2);
    this.dataView.setInt16(this.byteOffset, value, LE);
    this.byteOffset += 2;
  }
  writeInt16BE(value) {
    this._ensureSize(2);
    this.dataView.setInt16(this.byteOffset, value, BE);
    this.byteOffset += 2;
  }
  writeInt32LE(value) {
    this._ensureSize(4);
    this.dataView.setInt32(this.byteOffset, value, LE);
    this.byteOffset += 4;
  }
  writeInt32BE(value) {
    this._ensureSize(4);
    this.dataView.setInt32(this.byteOffset, value, BE);
    this.byteOffset += 4;
  }
  writeFloatLE(value) {
    this._ensureSize(4);
    this.dataView.setFloat32(this.byteOffset, value, LE);
    this.byteOffset += 4;
  }
  writeFloatBE(value) {
    this._ensureSize(4);
    this.dataView.setFloat32(this.byteOffset, value, BE);
    this.byteOffset += 4;
  }
  writeDoubleLE(value) {
    this._ensureSize(8);
    this.dataView.setFloat64(this.byteOffset, value, LE);
    this.byteOffset += 8;
  }
  writeDoubleBE(value) {
    this._ensureSize(8);
    this.dataView.setFloat64(this.byteOffset, value, BE);
    this.byteOffset += 8;
  }
  writeVarInt(value) {
    let length = 1;
    while ((value & 0xffffff80) !== 0) {
      this.writeUInt8(value & 0x7f | 0x80);
      value >>>= 7;
      length++;
    }
    this.writeUInt8(value & 0x7f);
    return length;
  }
  writeBuffer(arrayBuffer) {
    this._ensureSize(arrayBuffer.byteLength);
    const tempArray = new Uint8Array(this.arrayBuffer);
    tempArray.set(new Uint8Array(arrayBuffer), this.byteOffset);
    this.byteOffset += arrayBuffer.byteLength;
  }
  _ensureSize(size) {
    if (this.arrayBuffer.byteLength < this.byteOffset + size) {
      if (this.allowResize) {
        const newArrayBuffer = new ArrayBuffer(this.byteOffset + size);
        const tempArray = new Uint8Array(newArrayBuffer);
        tempArray.set(new Uint8Array(this.arrayBuffer));
        this.arrayBuffer = newArrayBuffer;
      } else {
        throw new Error('BinaryWriter overflow');
      }
    }
  }
}
//# sourceMappingURL=binary-writer.js.map