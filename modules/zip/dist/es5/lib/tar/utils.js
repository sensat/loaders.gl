"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.clean = clean;
exports.pad = pad;
exports.stringToUint8 = stringToUint8;
function clean(length) {
  var i;
  var buffer = new Uint8Array(length);
  for (i = 0; i < length; i += 1) {
    buffer[i] = 0;
  }
  return buffer;
}
function pad(num, bytes, base) {
  var numStr = num.toString(base || 8);
  return '000000000000'.substr(numStr.length + 12 - bytes) + numStr;
}
function stringToUint8(input, out, offset) {
  var i;
  var length;
  out = out || clean(input.length);
  offset = offset || 0;
  for (i = 0, length = input.length; i < length; i += 1) {
    out[offset] = input.charCodeAt(i);
    offset += 1;
  }
  return out;
}
//# sourceMappingURL=utils.js.map