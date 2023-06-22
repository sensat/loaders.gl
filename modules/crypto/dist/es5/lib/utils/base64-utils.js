"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toBase64 = toBase64;
function toBase64(string) {
  string = "".concat(string);
  for (var i = 0; i < string.length; i++) {
    if (string.charCodeAt(i) > 255) {
      return null;
    }
  }
  var out = '';
  for (var _i = 0; _i < string.length; _i += 3) {
    var groupsOfSix = [undefined, undefined, undefined, undefined];
    groupsOfSix[0] = string.charCodeAt(_i) >> 2;
    groupsOfSix[1] = (string.charCodeAt(_i) & 0x03) << 4;
    if (string.length > _i + 1) {
      groupsOfSix[1] |= string.charCodeAt(_i + 1) >> 4;
      groupsOfSix[2] = (string.charCodeAt(_i + 1) & 0x0f) << 2;
    }
    if (string.length > _i + 2) {
      groupsOfSix[2] |= string.charCodeAt(_i + 2) >> 6;
      groupsOfSix[3] = string.charCodeAt(_i + 2) & 0x3f;
    }
    for (var j = 0; j < groupsOfSix.length; j++) {
      if (typeof groupsOfSix[j] === 'undefined') {
        out += '=';
      } else {
        out += btoaLookup(groupsOfSix[j]);
      }
    }
  }
  return out;
}
function btoaLookup(idx) {
  if (idx < 26) {
    return String.fromCharCode(idx + 'A'.charCodeAt(0));
  }
  if (idx < 52) {
    return String.fromCharCode(idx - 26 + 'a'.charCodeAt(0));
  }
  if (idx < 62) {
    return String.fromCharCode(idx - 52 + '0'.charCodeAt(0));
  }
  if (idx === 62) {
    return '+';
  }
  if (idx === 63) {
    return '/';
  }
  return undefined;
}
//# sourceMappingURL=base64-utils.js.map