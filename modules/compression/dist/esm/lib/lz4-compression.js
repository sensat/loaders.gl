import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { toArrayBuffer } from '@loaders.gl/loader-utils';
import { Compression } from './compression';
const LZ4_MAGIC_NUMBER = 0x184d2204;
let lz4js;
export class LZ4Compression extends Compression {
  constructor(options) {
    var _this$options, _this$options$modules;
    super(options);
    _defineProperty(this, "name", 'lz4');
    _defineProperty(this, "extensions", ['lz4']);
    _defineProperty(this, "contentEncodings", ['x-lz4']);
    _defineProperty(this, "isSupported", true);
    _defineProperty(this, "options", void 0);
    this.options = options;
    lz4js = lz4js || ((_this$options = this.options) === null || _this$options === void 0 ? void 0 : (_this$options$modules = _this$options.modules) === null || _this$options$modules === void 0 ? void 0 : _this$options$modules.lz4js);
    if (!lz4js) {
      throw new Error(this.name);
    }
  }
  compressSync(input) {
    const inputArray = new Uint8Array(input);
    return lz4js.compress(inputArray).buffer;
  }
  decompressSync(data, maxSize) {
    try {
      const isMagicNumberExists = this.checkMagicNumber(data);
      const inputArray = new Uint8Array(data);
      if (isMagicNumberExists) {
        return lz4js.decompress(inputArray, maxSize).buffer;
      }
      if (!maxSize) {
        const error = new Error('Need to provide maxSize');
        throw this.improveError(error);
      }
      let uncompressed = new Uint8Array(maxSize);
      const uncompressedSize = this.decodeBlock(inputArray, uncompressed);
      uncompressed = uncompressed.slice(0, uncompressedSize);
      return toArrayBuffer(uncompressed);
    } catch (error) {
      throw this.improveError(error);
    }
  }
  decodeBlock(data, output, startIndex, endIndex) {
    startIndex = startIndex || 0;
    endIndex = endIndex || data.length - startIndex;
    let uncompressedSize = 0;
    for (let index = startIndex; index < endIndex;) {
      const token = data[index++];
      let literalsLength = token >> 4;
      if (literalsLength > 0) {
        let length = literalsLength + 240;
        while (length === 255) {
          length = data[index++];
          literalsLength += length;
        }
        const end = index + literalsLength;
        while (index < end) {
          output[uncompressedSize++] = data[index++];
        }
        if (index === endIndex) {
          return uncompressedSize;
        }
      }
      const offset = data[index++] | data[index++] << 8;
      if (offset === 0 || offset > uncompressedSize) {
        return -(index - 2);
      }
      let matchLength = token & 0xf;
      let length = matchLength + 240;
      while (length === 255) {
        length = data[index++];
        matchLength += length;
      }
      let pos = uncompressedSize - offset;
      const end = uncompressedSize + matchLength + 4;
      while (uncompressedSize < end) {
        output[uncompressedSize++] = output[pos++];
      }
    }
    return uncompressedSize;
  }
  checkMagicNumber(data) {
    const magic = new Uint32Array(data.slice(0, 4));
    return magic[0] === LZ4_MAGIC_NUMBER;
  }
}
//# sourceMappingURL=lz4-compression.js.map