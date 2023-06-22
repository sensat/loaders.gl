"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var path = require('path');
var fs = require('fs');
var promises = fs.promises;
var I3S_LAYER_PATH = process.env.I3sLayerPath || '';
var FULL_LAYER_PATH = path.join(process.cwd(), I3S_LAYER_PATH);
function getFileNameByUrl(_x) {
  return _getFileNameByUrl.apply(this, arguments);
}
function _getFileNameByUrl() {
  _getFileNameByUrl = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(url) {
    var extensions, _i, _extensions, ext, fileName;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          extensions = ['json', 'bin', 'jpg', 'jpeg', 'png', 'bin.dds', 'ktx2'];
          _i = 0, _extensions = extensions;
        case 2:
          if (!(_i < _extensions.length)) {
            _context.next = 17;
            break;
          }
          ext = _extensions[_i];
          fileName = "".concat(FULL_LAYER_PATH).concat(url, "/index.").concat(ext);
          _context.prev = 5;
          _context.next = 8;
          return promises.access(fileName);
        case 8:
          return _context.abrupt("return", fileName);
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](5);
          return _context.abrupt("continue", 14);
        case 14:
          _i++;
          _context.next = 2;
          break;
        case 17:
          return _context.abrupt("return", null);
        case 18:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[5, 11]]);
  }));
  return _getFileNameByUrl.apply(this, arguments);
}
module.exports = {
  getFileNameByUrl: getFileNameByUrl
};
//# sourceMappingURL=index-controller.js.map