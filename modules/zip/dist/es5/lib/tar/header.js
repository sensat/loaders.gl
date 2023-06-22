"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.format = format;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var utils = _interopRequireWildcard(require("./utils"));
function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }
function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }
var structure = {
  fileName: 100,
  fileMode: 8,
  uid: 8,
  gid: 8,
  fileSize: 12,
  mtime: 12,
  checksum: 8,
  type: 1,
  linkName: 100,
  ustar: 8,
  owner: 32,
  group: 32,
  majorNumber: 8,
  minorNumber: 8,
  filenamePrefix: 155,
  padding: 12
};
function format(data, cb) {
  var buffer = utils.clean(512);
  var offset = 0;
  Object.entries(structure).forEach(function (_ref) {
    var _ref2 = (0, _slicedToArray2.default)(_ref, 2),
      field = _ref2[0],
      length = _ref2[1];
    var str = data[field] || '';
    var i;
    var fieldLength;
    for (i = 0, fieldLength = str.length; i < fieldLength; i += 1) {
      buffer[offset] = str.charCodeAt(i);
      offset += 1;
    }
    offset += length - i;
  });
  if (typeof cb === 'function') {
    return cb(buffer, offset);
  }
  return buffer;
}
//# sourceMappingURL=header.js.map