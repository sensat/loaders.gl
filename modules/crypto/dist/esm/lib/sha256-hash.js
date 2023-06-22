import { CryptoHash } from './crypto-hash';
export class SHA256Hash extends CryptoHash {
  constructor(options) {
    super({
      ...options,
      crypto: {
        ...options.crypto,
        algorithm: 'SHA256'
      }
    });
  }
}
//# sourceMappingURL=sha256-hash.js.map