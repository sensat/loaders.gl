"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckVideoLoader = exports.VideoLoader = void 0;
const parse_video_1 = __importDefault(require("./lib/parsers/parse-video"));
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const EXTENSIONS = ['mp4'];
const MIME_TYPES = ['video/mp4'];
const DEFAULT_LOADER_OPTIONS = {
    video: {}
};
exports.VideoLoader = {
    name: 'Video',
    id: 'video',
    module: 'video',
    version: VERSION,
    extensions: EXTENSIONS,
    mimeTypes: MIME_TYPES,
    parse: parse_video_1.default,
    // tests: arrayBuffer => Boolean(getBinaryImageMetadata(new DataView(arrayBuffer))),
    options: DEFAULT_LOADER_OPTIONS
};
exports._typecheckVideoLoader = exports.VideoLoader;
