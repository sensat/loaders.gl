"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VERSION = void 0;
var DEFAULT_VERSION = 'beta';
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : DEFAULT_VERSION;
exports.VERSION = VERSION;
if (typeof "4.0.0-alpha.7" === 'undefined') {
  console.error('loaders.gl: The __VERSION__ variable is not injected using babel plugin. Latest unstable workers would be fetched from the CDN.');
}
//# sourceMappingURL=version.js.map