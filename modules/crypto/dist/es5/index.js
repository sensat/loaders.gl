"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "CRC32CHash", {
  enumerable: true,
  get: function get() {
    return _crc32cHash.CRC32CHash;
  }
});
Object.defineProperty(exports, "CRC32Hash", {
  enumerable: true,
  get: function get() {
    return _crc32Hash.CRC32Hash;
  }
});
Object.defineProperty(exports, "CryptoHash", {
  enumerable: true,
  get: function get() {
    return _cryptoHash.CryptoHash;
  }
});
exports.CryptoWorker = exports.CryptoJSWorker = void 0;
Object.defineProperty(exports, "MD5Hash", {
  enumerable: true,
  get: function get() {
    return _md5Hash.MD5Hash;
  }
});
Object.defineProperty(exports, "NodeHash", {
  enumerable: true,
  get: function get() {
    return _nodeHash.NodeHash;
  }
});
Object.defineProperty(exports, "SHA256Hash", {
  enumerable: true,
  get: function get() {
    return _sha256Hash.SHA256Hash;
  }
});
Object.defineProperty(exports, "_hexToBase64", {
  enumerable: true,
  get: function get() {
    return _digestUtils.hexToBase64;
  }
});
Object.defineProperty(exports, "_toHex", {
  enumerable: true,
  get: function get() {
    return _digestUtils.toHex;
  }
});
var _crc32Hash = require("./lib/crc32-hash");
var _crc32cHash = require("./lib/crc32c-hash");
var _md5Hash = require("./lib/md5-hash");
var _sha256Hash = require("./lib/sha256-hash");
var _cryptoHash = require("./lib/crypto-hash");
var _nodeHash = require("./lib/node-hash");
var _digestUtils = require("./lib/utils/digest-utils");
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var CryptoWorker = {
  id: 'crypto',
  name: 'CRC32, CRC32c and MD5 Hashes',
  module: 'crypto',
  version: VERSION,
  options: {
    crypto: {}
  }
};
exports.CryptoWorker = CryptoWorker;
var CryptoJSWorker = {
  id: 'cryptojs',
  name: 'Cryptographic Hashes',
  module: 'crypto',
  version: VERSION,
  options: {
    cryptojs: {}
  }
};
exports.CryptoJSWorker = CryptoJSWorker;
//# sourceMappingURL=index.js.map