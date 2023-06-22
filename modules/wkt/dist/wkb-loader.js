"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports._typecheckWKBLoader = exports._typecheckWKBWorkerLoader = exports.WKBLoader = exports.WKBWorkerLoader = void 0;
const version_1 = require("./lib/utils/version");
const parse_wkb_1 = __importDefault(require("./lib/parse-wkb"));
/**
 * Worker loader for WKB (Well-Known Binary)
 */
exports.WKBWorkerLoader = {
    name: 'WKB',
    id: 'wkb',
    module: 'wkt',
    version: version_1.VERSION,
    worker: true,
    category: 'geometry',
    extensions: ['wkb'],
    mimeTypes: [],
    options: {
        wkb: {}
    }
};
/**
 * Loader for WKB (Well-Known Binary)
 */
exports.WKBLoader = {
    ...exports.WKBWorkerLoader,
    parse: async (arrayBuffer) => (0, parse_wkb_1.default)(arrayBuffer),
    parseSync: parse_wkb_1.default
};
exports._typecheckWKBWorkerLoader = exports.WKBWorkerLoader;
exports._typecheckWKBLoader = exports.WKBLoader;
