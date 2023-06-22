import { createWorker } from '@loaders.gl/worker-utils';
import { CRC32Hash } from '../lib/crc32-hash';
import { CRC32CHash } from '../lib/crc32c-hash';
import { MD5Hash } from '../lib/md5-hash';
export { CRC32Hash, CRC32CHash };
createWorker(async function (data) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const {
    operation
  } = options;
  switch (operation) {
    case 'crc32':
      return await new CRC32Hash(options).hash(data);
    case 'crc32c':
      return await new CRC32CHash(options).hash(data);
    case 'md5':
      return await new MD5Hash(options).hash(data);
    default:
      throw new Error("invalid option: ".concat(operation));
  }
});
//# sourceMappingURL=worker.js.map