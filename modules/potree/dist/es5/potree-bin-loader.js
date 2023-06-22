"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PotreeBinLoader = void 0;
var _parsePotreeBin = _interopRequireDefault(require("./parsers/parse-potree-bin"));
var PotreeBinLoader = {
  name: 'potree Binary Point Attributes',
  id: 'potree',
  extensions: ['bin'],
  mimeTypes: ['application/octet-stream'],
  parseSync: parseSync,
  binary: true
};
exports.PotreeBinLoader = PotreeBinLoader;
function parseSync(arrayBuffer, options) {
  var index = {};
  var byteOffset = 0;
  (0, _parsePotreeBin.default)(arrayBuffer, byteOffset, options, index);
  return index;
}
//# sourceMappingURL=potree-bin-loader.js.map