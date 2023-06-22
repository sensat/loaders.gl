"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseVideo;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
function parseVideo(_x) {
  return _parseVideo.apply(this, arguments);
}
function _parseVideo() {
  _parseVideo = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(arrayBuffer) {
    var blob, video;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          blob = new Blob([arrayBuffer]);
          video = document.createElement('video');
          video.src = URL.createObjectURL(blob);
          return _context.abrupt("return", video);
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _parseVideo.apply(this, arguments);
}
//# sourceMappingURL=parse-video.js.map