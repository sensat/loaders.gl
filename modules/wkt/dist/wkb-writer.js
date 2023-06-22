"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WKBWriter = void 0;
const version_1 = require("./lib/utils/version");
const encode_wkb_1 = __importDefault(require("./lib/encode-wkb"));
/**
 * WKB exporter
 */
exports.WKBWriter = {
    name: 'WKB (Well Known Binary)',
    id: 'wkb',
    module: 'wkt',
    version: version_1.VERSION,
    extensions: ['wkb'],
    // @ts-ignore
    encodeSync: encode_wkb_1.default,
    options: {
        wkb: {
            hasZ: false,
            hasM: false
        }
    }
};
