"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hexToBase64 = hexToBase64;
exports.toHex = toHex;
var _base64Utils = require("./base64-utils");
function toHex(cipher) {
  var hexString = cipher.toString(16);
  return hexString === '0' ? "0".concat(hexString) : hexString;
}
function hexToBase64(hexstring) {
  if (hexstring.length % 2 !== 0) {
    hexstring = "0".concat(hexstring);
  }
  var matches = hexstring.match(/\w{2}/g) || [];
  var string = matches.map(function (a) {
    return String.fromCharCode(parseInt(a, 16));
  }).join('');
  return (0, _base64Utils.toBase64)(string) || '';
}
//# sourceMappingURL=digest-utils.js.map