"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WKTWriter = void 0;
var _version = require("./lib/utils/version");
var _encodeWkt = _interopRequireDefault(require("./lib/encode-wkt"));
var WKTWriter = {
  name: 'WKT (Well Known Text)',
  id: 'wkt',
  module: 'wkt',
  version: _version.VERSION,
  extensions: ['wkt'],
  encode: _encodeWkt.default,
  options: {
    wkt: {}
  }
};
exports.WKTWriter = WKTWriter;
//# sourceMappingURL=wkt-writer.js.map