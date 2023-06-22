"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WKBWriter = void 0;
var _version = require("./lib/utils/version");
var _encodeWkb = _interopRequireDefault(require("./lib/encode-wkb"));
var WKBWriter = {
  name: 'WKB (Well Known Binary)',
  id: 'wkb',
  module: 'wkt',
  version: _version.VERSION,
  extensions: ['wkb'],
  encodeSync: _encodeWkb.default,
  options: {
    wkb: {
      hasZ: false,
      hasM: false
    }
  }
};
exports.WKBWriter = WKBWriter;
//# sourceMappingURL=wkb-writer.js.map