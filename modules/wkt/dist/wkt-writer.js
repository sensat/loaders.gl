"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WKTWriter = void 0;
const version_1 = require("./lib/utils/version");
const encode_wkt_1 = __importDefault(require("./lib/encode-wkt"));
/**
 * WKT exporter
 */
exports.WKTWriter = {
    name: 'WKT (Well Known Text)',
    id: 'wkt',
    module: 'wkt',
    version: version_1.VERSION,
    extensions: ['wkt'],
    // @ts-ignore
    encode: encode_wkt_1.default,
    options: {
        wkt: {}
    }
};
