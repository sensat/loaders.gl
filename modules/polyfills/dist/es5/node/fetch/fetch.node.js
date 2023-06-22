"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createHTTPRequestReadStream = createHTTPRequestReadStream;
exports.fetchNode = fetchNode;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _http = _interopRequireDefault(require("http"));
var _https = _interopRequireDefault(require("https"));
var _response = require("./response.node");
var _headers = require("./headers.node");
var _decodeDataUri2 = require("./utils/decode-data-uri.node");
var _fetchFile = require("./fetch-file.node");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { (0, _defineProperty2.default)(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
var isDataURL = function isDataURL(url) {
  return url.startsWith('data:');
};
var isRequestURL = function isRequestURL(url) {
  return url.startsWith('http:') || url.startsWith('https:');
};
function fetchNode(_x, _x2) {
  return _fetchNode.apply(this, arguments);
}
function _fetchNode() {
  _fetchNode = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee(url, options) {
    var _decodeDataUri, arrayBuffer, mimeType, response, syntheticResponseHeaders, originalUrl, body, headers, _getStatus, status, statusText, followRedirect, redirectUrl;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          if (!(!isRequestURL(url) && !isDataURL(url))) {
            _context.next = 5;
            break;
          }
          _context.next = 4;
          return (0, _fetchFile.fetchFileNode)(url, options);
        case 4:
          return _context.abrupt("return", _context.sent);
        case 5:
          if (!isDataURL(url)) {
            _context.next = 9;
            break;
          }
          _decodeDataUri = (0, _decodeDataUri2.decodeDataUri)(url), arrayBuffer = _decodeDataUri.arrayBuffer, mimeType = _decodeDataUri.mimeType;
          response = new _response.Response(arrayBuffer, {
            headers: {
              'content-type': mimeType
            },
            url: url
          });
          return _context.abrupt("return", response);
        case 9:
          syntheticResponseHeaders = {};
          originalUrl = url;
          if (url.endsWith('.gz')) {
            url = url.slice(0, -3);
            syntheticResponseHeaders['content-encoding'] = 'gzip';
          }
          _context.next = 14;
          return createHTTPRequestReadStream(originalUrl, options);
        case 14:
          body = _context.sent;
          headers = getHeaders(url, body, syntheticResponseHeaders);
          _getStatus = getStatus(body), status = _getStatus.status, statusText = _getStatus.statusText;
          followRedirect = !options || options.followRedirect || options.followRedirect === undefined;
          if (!(status >= 300 && status < 400 && headers.has('location') && followRedirect)) {
            _context.next = 23;
            break;
          }
          redirectUrl = generateRedirectUrl(url, headers.get('location'));
          _context.next = 22;
          return fetchNode(redirectUrl, options);
        case 22:
          return _context.abrupt("return", _context.sent);
        case 23:
          return _context.abrupt("return", new _response.Response(body, {
            headers: headers,
            status: status,
            statusText: statusText,
            url: url
          }));
        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](0);
          return _context.abrupt("return", new _response.Response(null, {
            status: 400,
            statusText: String(_context.t0),
            url: url
          }));
        case 29:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 26]]);
  }));
  return _fetchNode.apply(this, arguments);
}
function createHTTPRequestReadStream(_x3, _x4) {
  return _createHTTPRequestReadStream.apply(this, arguments);
}
function _createHTTPRequestReadStream() {
  _createHTTPRequestReadStream = (0, _asyncToGenerator2.default)(_regenerator.default.mark(function _callee2(url, options) {
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return new Promise(function (resolve, reject) {
            var requestOptions = getRequestOptions(url, options);
            var req = url.startsWith('https:') ? _https.default.request(requestOptions, function (res) {
              return resolve(res);
            }) : _http.default.request(requestOptions, function (res) {
              return resolve(res);
            });
            req.on('error', function (error) {
              return reject(error);
            });
            req.end();
          });
        case 2:
          return _context2.abrupt("return", _context2.sent);
        case 3:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _createHTTPRequestReadStream.apply(this, arguments);
}
function generateRedirectUrl(originalUrl, location) {
  if (location.startsWith('http')) {
    return location;
  }
  var url = new URL(originalUrl);
  url.pathname = location;
  return url.href;
}
function getRequestOptions(url, options) {
  var originalHeaders = (options === null || options === void 0 ? void 0 : options.headers) || {};
  var headers = {};
  for (var _i = 0, _Object$keys = Object.keys(originalHeaders); _i < _Object$keys.length; _i++) {
    var key = _Object$keys[_i];
    headers[key.toLowerCase()] = originalHeaders[key];
  }
  headers['accept-encoding'] = headers['accept-encoding'] || 'gzip,br,deflate';
  var urlObject = new URL(url);
  return _objectSpread(_objectSpread(_objectSpread({
    hostname: urlObject.hostname,
    path: urlObject.pathname,
    method: 'GET'
  }, options), options === null || options === void 0 ? void 0 : options.fetch), {}, {
    headers: headers,
    port: urlObject.port
  });
}
function getStatus(httpResponse) {
  if (httpResponse.statusCode) {
    return {
      status: httpResponse.statusCode,
      statusText: httpResponse.statusMessage || 'NA'
    };
  }
  return {
    status: 200,
    statusText: 'OK'
  };
}
function getHeaders(url, httpResponse) {
  var additionalHeaders = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var headers = {};
  if (httpResponse && httpResponse.headers) {
    var httpHeaders = httpResponse.headers;
    for (var key in httpHeaders) {
      var header = httpHeaders[key];
      headers[key.toLowerCase()] = String(header);
    }
  }
  if (!headers['content-length']) {
    var contentLength = getContentLength(url);
    if (Number.isFinite(contentLength)) {
      headers['content-length'] = contentLength;
    }
  }
  Object.assign(headers, additionalHeaders);
  return new _headers.Headers(headers);
}
function getContentLength(url) {
  return isDataURL(url) ? url.length - 'data:'.length : null;
}
//# sourceMappingURL=fetch.node.js.map