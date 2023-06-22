"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseSLPK = parseSLPK;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _cdFileHeader = require("../parse-zip/cd-file-header");
var _localFileHeader = require("../parse-zip/local-file-header");
var _slpkArchieve = require("./slpk-archieve");
var getByteAt = function getByteAt(offset, buffer) {
  return buffer.getUint8(buffer.byteOffset + offset);
};
function parseSLPK(_x) {
  return _parseSLPK.apply(this, arguments);
}
function _parseSLPK() {
  _parseSLPK = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
    var _options$slpk$path, _options$slpk, _options$slpk2;
    var options,
      archive,
      cdFileHeaderSignature,
      searchWindow,
      hashCDOffset,
      i,
      cdFileHeader,
      textDecoder,
      localFileHeader,
      fileDataOffset,
      hashFile,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          archive = new DataView(data);
          cdFileHeaderSignature = [80, 75, 1, 2];
          searchWindow = [getByteAt(archive.byteLength - 1, archive), getByteAt(archive.byteLength - 2, archive), getByteAt(archive.byteLength - 3, archive), undefined];
          hashCDOffset = 0;
          i = archive.byteLength - 4;
        case 6:
          if (!(i > -1)) {
            _context.next = 17;
            break;
          }
          searchWindow[3] = searchWindow[2];
          searchWindow[2] = searchWindow[1];
          searchWindow[1] = searchWindow[0];
          searchWindow[0] = getByteAt(i, archive);
          if (!searchWindow.every(function (val, index) {
            return val === cdFileHeaderSignature[index];
          })) {
            _context.next = 14;
            break;
          }
          hashCDOffset = i;
          return _context.abrupt("break", 17);
        case 14:
          i--;
          _context.next = 6;
          break;
        case 17:
          cdFileHeader = (0, _cdFileHeader.parseZipCDFileHeader)(hashCDOffset, archive);
          textDecoder = new TextDecoder();
          if (!(textDecoder.decode(cdFileHeader.fileName) !== '@specialIndexFileHASH128@')) {
            _context.next = 21;
            break;
          }
          throw new Error('No hash file in slpk');
        case 21:
          localFileHeader = (0, _localFileHeader.parseZipLocalFileHeader)(cdFileHeader.localHeaderOffset, archive);
          fileDataOffset = localFileHeader.fileDataOffset;
          hashFile = archive.buffer.slice(fileDataOffset, fileDataOffset + localFileHeader.compressedSize);
          if (hashFile) {
            _context.next = 26;
            break;
          }
          throw new Error('No hash file in slpk');
        case 26:
          _context.next = 28;
          return new _slpkArchieve.SLPKArchive(data, hashFile).getFile((_options$slpk$path = (_options$slpk = options.slpk) === null || _options$slpk === void 0 ? void 0 : _options$slpk.path) !== null && _options$slpk$path !== void 0 ? _options$slpk$path : '', (_options$slpk2 = options.slpk) === null || _options$slpk2 === void 0 ? void 0 : _options$slpk2.pathMode);
        case 28:
          return _context.abrupt("return", _context.sent);
        case 29:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseSLPK.apply(this, arguments);
}
//# sourceMappingURL=parse-slpk.js.map