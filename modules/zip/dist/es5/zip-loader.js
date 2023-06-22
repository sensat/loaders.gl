"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckZipLoader = exports.ZipLoader = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jszip = _interopRequireDefault(require("jszip"));
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var ZipLoader = {
  id: 'zip',
  module: 'zip',
  name: 'Zip Archive',
  version: VERSION,
  extensions: ['zip'],
  mimeTypes: ['application/zip'],
  category: 'archive',
  tests: ['PK'],
  options: {},
  parse: parseZipAsync
};
exports.ZipLoader = ZipLoader;
function parseZipAsync(_x) {
  return _parseZipAsync.apply(this, arguments);
}
function _parseZipAsync() {
  _parseZipAsync = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(data) {
    var options,
      promises,
      fileMap,
      jsZip,
      zip,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          promises = [];
          fileMap = {};
          _context.prev = 3;
          jsZip = new _jszip.default();
          _context.next = 7;
          return jsZip.loadAsync(data, options);
        case 7:
          zip = _context.sent;
          zip.forEach(function (relativePath, zipEntry) {
            var subFilename = zipEntry.name;
            var promise = loadZipEntry(jsZip, subFilename, options).then(function (arrayBufferOrError) {
              fileMap[relativePath] = arrayBufferOrError;
            });
            promises.push(promise);
          });
          _context.next = 11;
          return Promise.all(promises);
        case 11:
          return _context.abrupt("return", fileMap);
        case 14:
          _context.prev = 14;
          _context.t0 = _context["catch"](3);
          options.log.error("Unable to read zip archive: ".concat(_context.t0));
          throw _context.t0;
        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[3, 14]]);
  }));
  return _parseZipAsync.apply(this, arguments);
}
function loadZipEntry(_x2, _x3) {
  return _loadZipEntry.apply(this, arguments);
}
function _loadZipEntry() {
  _loadZipEntry = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(jsZip, subFilename) {
    var options,
      arrayBuffer,
      _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
          _context2.prev = 1;
          _context2.next = 4;
          return jsZip.file(subFilename).async(options.dataType || 'arraybuffer');
        case 4:
          arrayBuffer = _context2.sent;
          return _context2.abrupt("return", arrayBuffer);
        case 8:
          _context2.prev = 8;
          _context2.t0 = _context2["catch"](1);
          options.log.error("Unable to read ".concat(subFilename, " from zip archive: ").concat(_context2.t0));
          return _context2.abrupt("return", _context2.t0);
        case 12:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[1, 8]]);
  }));
  return _loadZipEntry.apply(this, arguments);
}
var _typecheckZipLoader = ZipLoader;
exports._typecheckZipLoader = _typecheckZipLoader;
//# sourceMappingURL=zip-loader.js.map