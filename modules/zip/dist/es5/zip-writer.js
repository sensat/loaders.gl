"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ZipWriter = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _jszip = _interopRequireDefault(require("jszip"));
var ZipWriter = {
  name: 'Zip Archive',
  extensions: ['zip'],
  category: 'archive',
  mimeTypes: ['application/zip'],
  encode: encodeZipAsync
};
exports.ZipWriter = ZipWriter;
function encodeZipAsync(_x) {
  return _encodeZipAsync.apply(this, arguments);
}
function _encodeZipAsync() {
  _encodeZipAsync = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(fileMap) {
    var options,
      jsZip,
      subFileName,
      subFileData,
      _options,
      _options$onUpdate,
      onUpdate,
      _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          options = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
          jsZip = new _jszip.default();
          for (subFileName in fileMap) {
            subFileData = fileMap[subFileName];
            jsZip.file(subFileName, subFileData, options);
          }
          options = Object.assign({}, options, {
            type: 'arraybuffer'
          });
          _options = options, _options$onUpdate = _options.onUpdate, onUpdate = _options$onUpdate === void 0 ? function () {} : _options$onUpdate;
          return _context.abrupt("return", jsZip.generateAsync(options, onUpdate).catch(function (error) {
            options.log.error("Unable to write zip archive: ".concat(error));
            throw error;
          }));
        case 6:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _encodeZipAsync.apply(this, arguments);
}
//# sourceMappingURL=zip-writer.js.map