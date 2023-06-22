"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
require('@loaders.gl/polyfills');
var _require = require('@loaders.gl/core'),
  fetchFile = _require.fetchFile,
  parse = _require.parse;
var _require2 = require('@loaders.gl/i3s'),
  SLPKLoader = _require2.SLPKLoader;
var path = require('path');
var slpkArchive;
var loadArchive = function () {
  var _ref = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(fullLayerPath) {
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return fetchFile(fullLayerPath);
        case 2:
          _context.next = 4;
          return _context.sent.arrayBuffer();
        case 4:
          slpkArchive = _context.sent;
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return function loadArchive(_x) {
    return _ref.apply(this, arguments);
  };
}();
var I3S_LAYER_PATH = process.env.I3sLayerPath || '';
var FULL_LAYER_PATH = path.join(process.cwd(), I3S_LAYER_PATH);
loadArchive(FULL_LAYER_PATH);
function getFileByUrl(_x2) {
  return _getFileByUrl.apply(this, arguments);
}
function _getFileByUrl() {
  _getFileByUrl = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(url) {
    var trimmedPath, uncompressedFile;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          trimmedPath = /^\/?(.*)\/?$/.exec(url);
          if (!trimmedPath) {
            _context2.next = 12;
            break;
          }
          _context2.prev = 2;
          _context2.t0 = Buffer;
          _context2.next = 6;
          return parse(slpkArchive, SLPKLoader, {
            slpk: {
              path: trimmedPath[1],
              pathMode: 'http'
            }
          });
        case 6:
          _context2.t1 = _context2.sent;
          uncompressedFile = _context2.t0.from.call(_context2.t0, _context2.t1);
          _context2.next = 12;
          break;
        case 10:
          _context2.prev = 10;
          _context2.t2 = _context2["catch"](2);
        case 12:
          return _context2.abrupt("return", uncompressedFile);
        case 13:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[2, 10]]);
  }));
  return _getFileByUrl.apply(this, arguments);
}
module.exports = {
  loadArchive: loadArchive,
  getFileByUrl: getFileByUrl
};
//# sourceMappingURL=slpk-controller.js.map