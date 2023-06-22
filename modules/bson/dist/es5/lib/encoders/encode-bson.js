"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encodeBSONSync = encodeBSONSync;
var _bson = require("bson");
function encodeBSONSync(value, options) {
  var uint8Array = (0, _bson.serialize)(value);
  return uint8Array.buffer;
}
//# sourceMappingURL=encode-bson.js.map