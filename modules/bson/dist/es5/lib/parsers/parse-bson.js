"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseBSONSync = parseBSONSync;
var _bson = require("bson");
function parseBSONSync(value, options) {
  var parsedData = (0, _bson.deserialize)(new Uint8Array(value), options);
  return parsedData;
}
//# sourceMappingURL=parse-bson.js.map