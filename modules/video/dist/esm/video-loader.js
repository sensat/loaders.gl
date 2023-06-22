import parseVideo from './lib/parsers/parse-video';
const VERSION = typeof "4.0.0-alpha.7" !== 'undefined' ? "4.0.0-alpha.7" : 'latest';
const EXTENSIONS = ['mp4'];
const MIME_TYPES = ['video/mp4'];
const DEFAULT_LOADER_OPTIONS = {
  video: {}
};
export const VideoLoader = {
  name: 'Video',
  id: 'video',
  module: 'video',
  version: VERSION,
  extensions: EXTENSIONS,
  mimeTypes: MIME_TYPES,
  parse: parseVideo,
  options: DEFAULT_LOADER_OPTIONS
};
export const _typecheckVideoLoader = VideoLoader;
//# sourceMappingURL=video-loader.js.map