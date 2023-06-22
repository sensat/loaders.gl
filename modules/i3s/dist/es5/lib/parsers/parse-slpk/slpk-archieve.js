"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SLPKArchive = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _workerUtils = require("@loaders.gl/worker-utils");
var _md = _interopRequireDefault(require("md5"));
var _compression = require("@loaders.gl/compression");
var _localFileHeader = require("../parse-zip/local-file-header");
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var PATH_DESCRIPTIONS = [{
  test: /^$/,
  extensions: ['3dSceneLayer.json.gz']
}, {
  test: /^nodepages\/\d+$/,
  extensions: ['.json.gz']
}, {
  test: /^nodes\/\d+$/,
  extensions: ['/3dNodeIndexDocument.json.gz']
}, {
  test: /^nodes\/\d+\/textures\/.+$/,
  extensions: ['.jpg', '.png', '.bin.dds.gz', '.ktx']
}, {
  test: /^nodes\/\d+\/geometries\/\d+$/,
  extensions: ['.bin.gz', '.draco.gz']
}, {
  test: /^nodes\/\d+\/attributes\/f_\d+\/\d+$/,
  extensions: ['.bin.gz']
}, {
  test: /^statistics\/f_\d+\/\d+$/,
  extensions: ['.json.gz']
}, {
  test: /^nodes\/\d+\/shared$/,
  extensions: ['/sharedResource.json.gz']
}];
var SLPKArchive = function () {
  function SLPKArchive(slpkArchiveBuffer, hashFile) {
    (0, _classCallCheck2.default)(this, SLPKArchive);
    (0, _defineProperty2.default)(this, "slpkArchive", void 0);
    (0, _defineProperty2.default)(this, "hashArray", void 0);
    this.slpkArchive = new DataView(slpkArchiveBuffer);
    this.hashArray = this.parseHashFile(hashFile);
  }
  (0, _createClass2.default)(SLPKArchive, [{
    key: "parseHashFile",
    value: function parseHashFile(hashFile) {
      var hashFileBuffer = Buffer.from(hashFile);
      var hashArray = [];
      for (var i = 0; i < hashFileBuffer.buffer.byteLength; i = i + 24) {
        var offsetBuffer = new DataView(hashFileBuffer.buffer.slice(hashFileBuffer.byteOffset + i + 16, hashFileBuffer.byteOffset + i + 24));
        var offset = offsetBuffer.getUint32(offsetBuffer.byteOffset, true);
        hashArray.push({
          hash: Buffer.from(hashFileBuffer.subarray(hashFileBuffer.byteOffset + i, hashFileBuffer.byteOffset + i + 16)),
          offset: offset
        });
      }
      return hashArray;
    }
  }, {
    key: "getFile",
    value: function () {
      var _getFile = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(path) {
        var mode,
          _PATH_DESCRIPTIONS$fi,
          extensions,
          data,
          _iterator,
          _step,
          ext,
          decompressedFile,
          fileWithoutCompression,
          _args = arguments;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              mode = _args.length > 1 && _args[1] !== undefined ? _args[1] : 'raw';
              if (!(mode === 'http')) {
                _context.next = 26;
                break;
              }
              extensions = (_PATH_DESCRIPTIONS$fi = PATH_DESCRIPTIONS.find(function (val) {
                return val.test.test(path);
              })) === null || _PATH_DESCRIPTIONS$fi === void 0 ? void 0 : _PATH_DESCRIPTIONS$fi.extensions;
              if (!extensions) {
                _context.next = 26;
                break;
              }
              _iterator = _createForOfIteratorHelper(extensions);
              _context.prev = 5;
              _iterator.s();
            case 7:
              if ((_step = _iterator.n()).done) {
                _context.next = 16;
                break;
              }
              ext = _step.value;
              _context.next = 11;
              return this.getDataByPath("".concat(path).concat(ext));
            case 11:
              data = _context.sent;
              if (!data) {
                _context.next = 14;
                break;
              }
              return _context.abrupt("break", 16);
            case 14:
              _context.next = 7;
              break;
            case 16:
              _context.next = 21;
              break;
            case 18:
              _context.prev = 18;
              _context.t0 = _context["catch"](5);
              _iterator.e(_context.t0);
            case 21:
              _context.prev = 21;
              _iterator.f();
              return _context.finish(21);
            case 24:
              if (!data) {
                _context.next = 26;
                break;
              }
              return _context.abrupt("return", Buffer.from(data));
            case 26:
              if (!(mode === 'raw')) {
                _context.next = 35;
                break;
              }
              _context.next = 29;
              return this.getDataByPath("".concat(path, ".gz"));
            case 29:
              decompressedFile = _context.sent;
              if (!decompressedFile) {
                _context.next = 32;
                break;
              }
              return _context.abrupt("return", Buffer.from(decompressedFile));
            case 32:
              fileWithoutCompression = this.getFileBytes(path);
              if (!fileWithoutCompression) {
                _context.next = 35;
                break;
              }
              return _context.abrupt("return", Buffer.from(fileWithoutCompression));
            case 35:
              throw new Error('No such file in the archieve');
            case 36:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[5, 18, 21, 24]]);
      }));
      function getFile(_x) {
        return _getFile.apply(this, arguments);
      }
      return getFile;
    }()
  }, {
    key: "getDataByPath",
    value: function () {
      var _getDataByPath = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(path) {
        var data, decompressedData;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              data = this.getFileBytes(path);
              if (data) {
                _context2.next = 3;
                break;
              }
              return _context2.abrupt("return", undefined);
            case 3:
              if (!/\.gz$/.test(path)) {
                _context2.next = 8;
                break;
              }
              _context2.next = 6;
              return (0, _workerUtils.processOnWorker)(_compression.CompressionWorker, data, {
                compression: 'gzip',
                operation: 'decompress',
                _workerType: 'test',
                gzip: {}
              });
            case 6:
              decompressedData = _context2.sent;
              return _context2.abrupt("return", decompressedData);
            case 8:
              return _context2.abrupt("return", Buffer.from(data));
            case 9:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this);
      }));
      function getDataByPath(_x2) {
        return _getDataByPath.apply(this, arguments);
      }
      return getDataByPath;
    }()
  }, {
    key: "getFileBytes",
    value: function getFileBytes(path) {
      var nameHash = Buffer.from((0, _md.default)(path), 'hex');
      var fileInfo = this.hashArray.find(function (val) {
        return Buffer.compare(val.hash, nameHash) === 0;
      });
      if (!fileInfo) {
        return undefined;
      }
      var localFileHeader = (0, _localFileHeader.parseZipLocalFileHeader)(this.slpkArchive.byteOffset + (fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.offset), this.slpkArchive);
      var compressedFile = this.slpkArchive.buffer.slice(localFileHeader.fileDataOffset, localFileHeader.fileDataOffset + localFileHeader.compressedSize);
      return compressedFile;
    }
  }]);
  return SLPKArchive;
}();
exports.SLPKArchive = SLPKArchive;
//# sourceMappingURL=slpk-archieve.js.map