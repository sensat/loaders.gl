"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SIGNAL_ABORTED = void 0;
exports.ensureArray = ensureArray;
exports.getImageSize = getImageSize;
exports.intToRgba = intToRgba;
exports.isInterleaved = isInterleaved;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
function ensureArray(x) {
  return Array.isArray(x) ? x : [x];
}
function intToRgba(int) {
  if (!Number.isInteger(int)) {
    throw Error('Not an integer.');
  }
  var buffer = new ArrayBuffer(4);
  var view = new DataView(buffer);
  view.setInt32(0, int, false);
  var bytes = new Uint8Array(buffer);
  return Array.from(bytes);
}
function isInterleaved(shape) {
  var lastDimSize = shape[shape.length - 1];
  return lastDimSize === 3 || lastDimSize === 4;
}
function getImageSize(source) {
  var interleaved = isInterleaved(source.shape);
  var _source$shape$slice = source.shape.slice(interleaved ? -3 : -2),
    _source$shape$slice2 = (0, _slicedToArray2.default)(_source$shape$slice, 2),
    height = _source$shape$slice2[0],
    width = _source$shape$slice2[1];
  return {
    height: height,
    width: width
  };
}
var SIGNAL_ABORTED = '__vivSignalAborted';
exports.SIGNAL_ABORTED = SIGNAL_ABORTED;
//# sourceMappingURL=tiff-utils.js.map