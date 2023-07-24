"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _core = require("@loaders.gl/core");
var _constants = require("../constants");
var _fileHandleProvider = require("./helpers/file-handle-provider");
var _i3s = require("@loaders.gl/i3s");
var _loaderUtils = require("@loaders.gl/loader-utils");
var _compression = require("@loaders.gl/compression");
var _fileUtils = require("../lib/utils/file-utils");
var indexNames = ['3dSceneLayer.json.gz', '3dNodeIndexDocument.json.gz', 'sharedResource.json.gz'];
var SLPKExtractor = function () {
  function SLPKExtractor() {
    (0, _classCallCheck2.default)(this, SLPKExtractor);
  }
  (0, _createClass2.default)(SLPKExtractor, [{
    key: "extract",
    value: function () {
      var _extract = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(options) {
        var inputUrl, provider, localHeader, _localHeader, _localHeader2;
        return _regenerator.default.wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              if (!_core.isBrowser) {
                _context.next = 3;
                break;
              }
              console.log(_constants.BROWSER_ERROR_MESSAGE);
              return _context.abrupt("return", _constants.BROWSER_ERROR_MESSAGE);
            case 3:
              inputUrl = options.inputUrl;
              _context.next = 6;
              return _fileHandleProvider.FileHandleProvider.from(inputUrl);
            case 6:
              provider = _context.sent;
              _context.next = 9;
              return (0, _i3s.parseZipLocalFileHeader)(0, provider);
            case 9:
              localHeader = _context.sent;
            case 10:
              if (!localHeader) {
                _context.next = 29;
                break;
              }
              _context.t0 = this;
              _context.t1 = this;
              _context.t2 = this.correctIndexNames(localHeader.fileName);
              _context.next = 16;
              return provider.slice(localHeader.fileDataOffset, localHeader.fileDataOffset + localHeader.compressedSize);
            case 16:
              _context.t3 = _context.sent;
              _context.t4 = {
                name: _context.t2,
                data: _context.t3
              };
              _context.next = 20;
              return _context.t1.unGzip.call(_context.t1, _context.t4);
            case 20:
              _context.t5 = _context.sent;
              _context.t6 = options.outputPath;
              _context.next = 24;
              return _context.t0.writeFile.call(_context.t0, _context.t5, _context.t6);
            case 24:
              _context.next = 26;
              return (0, _i3s.parseZipLocalFileHeader)(((_localHeader = localHeader) === null || _localHeader === void 0 ? void 0 : _localHeader.fileDataOffset) + ((_localHeader2 = localHeader) === null || _localHeader2 === void 0 ? void 0 : _localHeader2.compressedSize), provider);
            case 26:
              localHeader = _context.sent;
              _context.next = 10;
              break;
            case 29:
              return _context.abrupt("return", 'success');
            case 30:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function extract(_x) {
        return _extract.apply(this, arguments);
      }
      return extract;
    }()
  }, {
    key: "correctIndexNames",
    value: function correctIndexNames(fileName) {
      if (indexNames.includes(_loaderUtils.path.filename(_loaderUtils.path.join('/', fileName)))) {
        return _loaderUtils.path.join(_loaderUtils.path.dirname(fileName), 'index.json.gz');
      }
      var parts = /^(.*\/[^\/\.]*)(\..+)$/.exec(fileName);
      if (!parts) {
        return null;
      }
      return "".concat(parts === null || parts === void 0 ? void 0 : parts.at(1), "/index").concat(parts === null || parts === void 0 ? void 0 : parts.at(2));
    }
  }, {
    key: "unGzip",
    value: function () {
      var _unGzip = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(file) {
        var _file$name;
        var _file$name2, compression, decompressedData;
        return _regenerator.default.wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              if (!/\.gz$/.test((_file$name = file.name) !== null && _file$name !== void 0 ? _file$name : '')) {
                _context2.next = 6;
                break;
              }
              compression = new _compression.GZipCompression();
              _context2.next = 4;
              return compression.decompress(file.data);
            case 4:
              decompressedData = _context2.sent;
              return _context2.abrupt("return", {
                data: decompressedData,
                name: ((_file$name2 = file.name) !== null && _file$name2 !== void 0 ? _file$name2 : '').slice(0, -3)
              });
            case 6:
              return _context2.abrupt("return", Promise.resolve(file));
            case 7:
            case "end":
              return _context2.stop();
          }
        }, _callee2);
      }));
      function unGzip(_x2) {
        return _unGzip.apply(this, arguments);
      }
      return unGzip;
    }()
  }, {
    key: "writeFile",
    value: function () {
      var _writeFile2 = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee3(options, outputPath) {
        var finalPath, dirName, fileName;
        return _regenerator.default.wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              if (options.name) {
                _context3.next = 2;
                break;
              }
              return _context3.abrupt("return");
            case 2:
              finalPath = _loaderUtils.path.join(outputPath, options.name);
              dirName = _loaderUtils.path.dirname(finalPath);
              fileName = _loaderUtils.path.filename(finalPath);
              _context3.next = 7;
              return (0, _fileUtils.writeFile)(dirName, options.data, fileName);
            case 7:
            case "end":
              return _context3.stop();
          }
        }, _callee3);
      }));
      function writeFile(_x3, _x4) {
        return _writeFile2.apply(this, arguments);
      }
      return writeFile;
    }()
  }]);
  return SLPKExtractor;
}();
exports.default = SLPKExtractor;
//# sourceMappingURL=slpk-extractor.js.map