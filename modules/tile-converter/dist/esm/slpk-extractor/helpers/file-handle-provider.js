import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { promises as fsPromises } from 'fs';
export class FileHandleProvider {
  static async from(path) {
    const fileDescriptor = await fsPromises.open(path);
    return new FileHandleProvider(fileDescriptor, (await fileDescriptor.stat()).size);
  }
  constructor(fileDescriptor, size) {
    _defineProperty(this, "fileDescriptor", void 0);
    _defineProperty(this, "size", void 0);
    this.fileDescriptor = fileDescriptor;
    this.size = size;
  }
  async getUint8(offset) {
    const val = new Uint8Array((await this.fileDescriptor.read(Buffer.alloc(1), 0, 1, offset)).buffer.buffer).at(0);
    if (val === undefined) {
      throw new Error('something went wrong');
    }
    return val;
  }
  async getUint16(offset) {
    const val = new Uint16Array((await this.fileDescriptor.read(Buffer.alloc(2), 0, 2, offset)).buffer.buffer).at(0);
    if (val === undefined) {
      throw new Error('something went wrong');
    }
    return val;
  }
  async getUint32(offset) {
    const val = new Uint32Array((await this.fileDescriptor.read(Buffer.alloc(4), 0, 4, offset)).buffer.buffer).at(0);
    if (val === undefined) {
      throw new Error('something went wrong');
    }
    return val;
  }
  async slice(startOffset, endOffset) {
    const length = endOffset - startOffset;
    return (await this.fileDescriptor.read(Buffer.alloc(length), 0, length, startOffset)).buffer.buffer;
  }
  get length() {
    return this.size;
  }
}
//# sourceMappingURL=file-handle-provider.js.map