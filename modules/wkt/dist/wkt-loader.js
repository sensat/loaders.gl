"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WKTLoader = exports.WKTWorkerLoader = void 0;
const version_1 = require("./lib/utils/version");
const parse_wkt_1 = __importDefault(require("./lib/parse-wkt"));
/**
 * Well-Known text loader
 */
exports.WKTWorkerLoader = {
    name: 'WKT (Well-Known Text)',
    id: 'wkt',
    module: 'wkt',
    version: version_1.VERSION,
    worker: true,
    extensions: ['wkt'],
    mimeTypes: ['text/plain'],
    category: 'geometry',
    text: true,
    options: {
        wkt: {}
    }
};
/**
 * Well-Known text loader
 */
exports.WKTLoader = {
    ...exports.WKTWorkerLoader,
    parse: async (arrayBuffer) => (0, parse_wkt_1.default)(new TextDecoder().decode(arrayBuffer)),
    parseTextSync: parse_wkt_1.default
};
