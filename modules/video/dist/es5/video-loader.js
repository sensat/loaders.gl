"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._typecheckVideoLoader = exports.VideoLoader = void 0;
var _parseVideo = _interopRequireDefault(require("./lib/parsers/parse-video"));
var VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
var EXTENSIONS = ['mp4'];
var MIME_TYPES = ['video/mp4'];
var DEFAULT_LOADER_OPTIONS = {
  video: {}
};
var VideoLoader = {
  name: 'Video',
  id: 'video',
  module: 'video',
  version: VERSION,
  extensions: EXTENSIONS,
  mimeTypes: MIME_TYPES,
  parse: _parseVideo.default,
  options: DEFAULT_LOADER_OPTIONS
};
exports.VideoLoader = VideoLoader;
var _typecheckVideoLoader = VideoLoader;
exports._typecheckVideoLoader = _typecheckVideoLoader;
//# sourceMappingURL=video-loader.js.map