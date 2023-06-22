"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NODE_FORMAT_SUPPORT = void 0;
exports.parseImageNode = parseImageNode;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _getPixels = _interopRequireDefault(require("get-pixels"));
var NODE_FORMAT_SUPPORT = ['image/png', 'image/jpeg', 'image/gif'];
exports.NODE_FORMAT_SUPPORT = NODE_FORMAT_SUPPORT;
function parseImageNode(_x, _x2) {
  return _parseImageNode.apply(this, arguments);
}
function _parseImageNode() {
  _parseImageNode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer, mimeType) {
    var buffer, ndarray;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (mimeType) {
            _context.next = 2;
            break;
          }
          throw new Error('MIMEType is required to parse image under Node.js');
        case 2:
          buffer = arrayBuffer instanceof Buffer ? arrayBuffer : Buffer.from(arrayBuffer);
          _context.next = 5;
          return getPixelsAsync(buffer, mimeType);
        case 5:
          ndarray = _context.sent;
          return _context.abrupt("return", ndarray);
        case 7:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseImageNode.apply(this, arguments);
}
function getPixelsAsync(buffer, mimeType) {
  return new Promise(function (resolve) {
    return (0, _getPixels.default)(buffer, mimeType, function (err, ndarray) {
      if (err) {
        throw err;
      }
      var shape = (0, _toConsumableArray2.default)(ndarray.shape);
      var layers = ndarray.shape.length === 4 ? ndarray.shape.shift() : 1;
      var data = ndarray.data instanceof Buffer ? new Uint8Array(ndarray.data) : ndarray.data;
      resolve({
        shape: shape,
        data: data,
        width: ndarray.shape[0],
        height: ndarray.shape[1],
        components: ndarray.shape[2],
        layers: layers ? [layers] : []
      });
    });
  });
}
//# sourceMappingURL=parse-image.node.js.map