import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
const DEFAULT_BYTE_LENGTH = 1024 * 8;
export class IOBuffer {
  constructor() {
    let data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_BYTE_LENGTH;
    let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    _defineProperty(this, "buffer", void 0);
    _defineProperty(this, "byteLength", void 0);
    _defineProperty(this, "byteOffset", void 0);
    _defineProperty(this, "length", void 0);
    _defineProperty(this, "offset", void 0);
    _defineProperty(this, "lastWrittenByte", void 0);
    _defineProperty(this, "littleEndian", void 0);
    _defineProperty(this, "_data", void 0);
    _defineProperty(this, "_mark", void 0);
    _defineProperty(this, "_marks", void 0);
    _defineProperty(this, "textDecoder", new TextDecoder());
    _defineProperty(this, "textEncoder", new TextEncoder());
    let dataIsGiven = false;
    if (typeof data === 'number') {
      data = new ArrayBuffer(data);
    } else {
      dataIsGiven = true;
      this.lastWrittenByte = data.byteLength;
    }
    const offset = options.offset ? options.offset >>> 0 : 0;
    const byteLength = data.byteLength - offset;
    let dvOffset = offset;
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
  available() {
    let byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return this.offset + byteLength <= this.length;
  }
  isLittleEndian() {
    return this.littleEndian;
  }
  setLittleEndian() {
    this.littleEndian = true;
    return this;
  }
  isBigEndian() {
    return !this.littleEndian;
  }
  setBigEndian() {
    this.littleEndian = false;
    return this;
  }
  skip() {
    let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    this.offset += n;
    return this;
  }
  seek(offset) {
    this.offset = offset;
    return this;
  }
  mark() {
    this._mark = this.offset;
    return this;
  }
  reset() {
    this.offset = this._mark;
    return this;
  }
  pushMark() {
    this._marks.push(this.offset);
    return this;
  }
  popMark() {
    const offset = this._marks.pop();
    if (offset === undefined) {
      throw new Error('Mark stack empty');
    }
    this.seek(offset);
    return this;
  }
  rewind() {
    this.offset = 0;
    return this;
  }
  ensureAvailable() {
    let byteLength = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    if (!this.available(byteLength)) {
      const lengthNeeded = this.offset + byteLength;
      const newLength = lengthNeeded * 2;
      const newArray = new Uint8Array(newLength);
      newArray.set(new Uint8Array(this.buffer));
      this.buffer = newArray.buffer;
      this.length = this.byteLength = newLength;
      this._data = new DataView(this.buffer);
    }
    return this;
  }
  readBoolean() {
    return this.readUint8() !== 0;
  }
  readInt8() {
    return this._data.getInt8(this.offset++);
  }
  readUint8() {
    return this._data.getUint8(this.offset++);
  }
  readByte() {
    return this.readUint8();
  }
  readBytes() {
    let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    const bytes = new Uint8Array(n);
    for (let i = 0; i < n; i++) {
      bytes[i] = this.readByte();
    }
    return bytes;
  }
  readInt16() {
    const value = this._data.getInt16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }
  readUint16() {
    const value = this._data.getUint16(this.offset, this.littleEndian);
    this.offset += 2;
    return value;
  }
  readInt32() {
    const value = this._data.getInt32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  readUint32() {
    const value = this._data.getUint32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  readFloat32() {
    const value = this._data.getFloat32(this.offset, this.littleEndian);
    this.offset += 4;
    return value;
  }
  readFloat64() {
    const value = this._data.getFloat64(this.offset, this.littleEndian);
    this.offset += 8;
    return value;
  }
  readChar() {
    return String.fromCharCode(this.readInt8());
  }
  readChars() {
    let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    let result = '';
    for (let i = 0; i < n; i++) {
      result += this.readChar();
    }
    return result;
  }
  readUtf8() {
    let n = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
    return this.textDecoder.decode(this.readBytes(n));
  }
  writeBoolean(value) {
    this.writeUint8(value ? 0xff : 0x00);
    return this;
  }
  writeInt8(value) {
    this.ensureAvailable(1);
    this._data.setInt8(this.offset++, value);
    this._updateLastWrittenByte();
    return this;
  }
  writeUint8(value) {
    this.ensureAvailable(1);
    this._data.setUint8(this.offset++, value);
    this._updateLastWrittenByte();
    return this;
  }
  writeByte(value) {
    return this.writeUint8(value);
  }
  writeBytes(bytes) {
    this.ensureAvailable(bytes.length);
    for (let i = 0; i < bytes.length; i++) {
      this._data.setUint8(this.offset++, bytes[i]);
    }
    this._updateLastWrittenByte();
    return this;
  }
  writeInt16(value) {
    this.ensureAvailable(2);
    this._data.setInt16(this.offset, value, this.littleEndian);
    this.offset += 2;
    this._updateLastWrittenByte();
    return this;
  }
  writeUint16(value) {
    this.ensureAvailable(2);
    this._data.setUint16(this.offset, value, this.littleEndian);
    this.offset += 2;
    this._updateLastWrittenByte();
    return this;
  }
  writeInt32(value) {
    this.ensureAvailable(4);
    this._data.setInt32(this.offset, value, this.littleEndian);
    this.offset += 4;
    this._updateLastWrittenByte();
    return this;
  }
  writeUint32(value) {
    this.ensureAvailable(4);
    this._data.setUint32(this.offset, value, this.littleEndian);
    this.offset += 4;
    this._updateLastWrittenByte();
    return this;
  }
  writeFloat32(value) {
    this.ensureAvailable(4);
    this._data.setFloat32(this.offset, value, this.littleEndian);
    this.offset += 4;
    this._updateLastWrittenByte();
    return this;
  }
  writeFloat64(value) {
    this.ensureAvailable(8);
    this._data.setFloat64(this.offset, value, this.littleEndian);
    this.offset += 8;
    this._updateLastWrittenByte();
    return this;
  }
  writeChar(str) {
    return this.writeUint8(str.charCodeAt(0));
  }
  writeChars(str) {
    for (let i = 0; i < str.length; i++) {
      this.writeUint8(str.charCodeAt(i));
    }
    return this;
  }
  writeUtf8(str) {
    const bytes = this.textEncoder.encode(str);
    return this.writeBytes(bytes);
  }
  toArray() {
    return new Uint8Array(this.buffer, this.byteOffset, this.lastWrittenByte);
  }
  _updateLastWrittenByte() {
    if (this.offset > this.lastWrittenByte) {
      this.lastWrittenByte = this.offset;
    }
  }
}
//# sourceMappingURL=iobuffer.js.map