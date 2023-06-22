import zlib from 'zlib';
import { toArrayBuffer } from './decode-data-uri.node';
export function decompressReadStream(readStream, headers) {
  switch (headers.get('content-encoding')) {
    case 'br':
      return readStream.pipe(zlib.createBrotliDecompress());
    case 'gzip':
      return readStream.pipe(zlib.createGunzip());
    case 'deflate':
      return readStream.pipe(zlib.createDeflate());
    default:
      return readStream;
  }
}
export async function concatenateReadStream(readStream) {
  const arrayBufferChunks = [];
  return await new Promise((resolve, reject) => {
    readStream.on('error', error => reject(error));
    readStream.on('readable', () => readStream.read());
    readStream.on('data', chunk => {
      if (typeof chunk === 'string') {
        reject(new Error('Read stream not binary'));
      }
      arrayBufferChunks.push(toArrayBuffer(chunk));
    });
    readStream.on('end', () => {
      const arrayBuffer = concatenateArrayBuffers(arrayBufferChunks);
      resolve(arrayBuffer);
    });
  });
}
export function concatenateArrayBuffers(sources) {
  const sourceArrays = sources.map(source2 => source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2);
  const byteLength = sourceArrays.reduce((length, typedArray) => length + typedArray.byteLength, 0);
  const result = new Uint8Array(byteLength);
  let offset = 0;
  for (const sourceArray of sourceArrays) {
    result.set(sourceArray, offset);
    offset += sourceArray.byteLength;
  }
  return result.buffer;
}
//# sourceMappingURL=stream-utils.node.js.map