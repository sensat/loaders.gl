export { CRC32Hash } from './lib/crc32-hash';
export { CRC32CHash } from './lib/crc32c-hash';
export { MD5Hash } from './lib/md5-hash';
export { SHA256Hash } from './lib/sha256-hash';
export { CryptoHash } from './lib/crypto-hash';
export { NodeHash } from './lib/node-hash';
export { hexToBase64 as _hexToBase64, toHex as _toHex } from './lib/utils/digest-utils';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
export const CryptoWorker = {
  id: 'crypto',
  name: 'CRC32, CRC32c and MD5 Hashes',
  module: 'crypto',
  version: VERSION,
  options: {
    crypto: {}
  }
};
export const CryptoJSWorker = {
  id: 'cryptojs',
  name: 'Cryptographic Hashes',
  module: 'crypto',
  version: VERSION,
  options: {
    cryptojs: {}
  }
};
//# sourceMappingURL=index.js.map