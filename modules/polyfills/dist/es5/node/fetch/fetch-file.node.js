"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchFileNode = fetchFileNode;
exports.isRequestURL = isRequestURL;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _fs = _interopRequireDefault(require("fs"));
var _response = require("./response.node");
var _headers2 = require("./headers.node");
function isRequestURL(url) {
  return url.startsWith('http:') || url.startsWith('https:');
}
function fetchFileNode(_x, _x2) {
  return _fetchFileNode.apply(this, arguments);
}
function _fetchFileNode() {
  _fetchFileNode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(url, options) {
    var noqueryUrl, body, status, statusText, headers, _status, _statusText, _headers;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          noqueryUrl = url.split('?')[0];
          _context.prev = 1;
          _context.next = 4;
          return new Promise(function (resolve, reject) {
            var stream = _fs.default.createReadStream(noqueryUrl, {
              encoding: null
            });
            stream.once('readable', function () {
              return resolve(stream);
            });
            stream.on('error', function (error) {
              return reject(error);
            });
          });
        case 4:
          body = _context.sent;
          status = 200;
          statusText = 'OK';
          headers = getHeadersForFile(noqueryUrl);
          return _context.abrupt("return", new _response.Response(body, {
            headers: headers,
            status: status,
            statusText: statusText,
            url: url
          }));
        case 11:
          _context.prev = 11;
          _context.t0 = _context["catch"](1);
          _status = 400;
          _statusText = _context.t0.message;
          _headers = {};
          return _context.abrupt("return", new _response.Response(_context.t0.message, {
            headers: _headers,
            status: _status,
            statusText: _statusText,
            url: url
          }));
        case 17:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[1, 11]]);
  }));
  return _fetchFileNode.apply(this, arguments);
}
function getHeadersForFile(noqueryUrl) {
  var headers = {};
  if (!headers['content-length']) {
    var stats = _fs.default.statSync(noqueryUrl);
    headers['content-length'] = stats.size;
  }
  if (noqueryUrl.endsWith('.gz')) {
    noqueryUrl = noqueryUrl.slice(0, -3);
    headers['content-encoding'] = 'gzip';
  }
  return new _headers2.Headers(headers);
}
//# sourceMappingURL=fetch-file.node.js.map