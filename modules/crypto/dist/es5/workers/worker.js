"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
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
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _workerUtils = require("@loaders.gl/worker-utils");
var _crc32Hash = require("../lib/crc32-hash");
var _crc32cHash = require("../lib/crc32c-hash");
var _md5Hash = require("../lib/md5-hash");
(0, _workerUtils.createWorker)(function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
    var options,
      operation,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          operation = options.operation;
          _context.t0 = operation;
          _context.next = _context.t0 === 'crc32' ? 5 : _context.t0 === 'crc32c' ? 8 : _context.t0 === 'md5' ? 11 : 14;
          break;
        case 5:
          _context.next = 7;
          return new _crc32Hash.CRC32Hash(options).hash(data);
        case 7:
          return _context.abrupt("return", _context.sent);
        case 8:
          _context.next = 10;
          return new _crc32cHash.CRC32CHash(options).hash(data);
        case 10:
          return _context.abrupt("return", _context.sent);
        case 11:
          _context.next = 13;
          return new _md5Hash.MD5Hash(options).hash(data);
        case 13:
          return _context.abrupt("return", _context.sent);
        case 14:
          throw new Error("invalid option: ".concat(operation));
        case 15:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function (_x) {
    return _ref.apply(this, arguments);
  };
}());
//# sourceMappingURL=worker.js.map