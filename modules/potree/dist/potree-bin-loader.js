"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PotreeBinLoader = void 0;
const parse_potree_bin_1 = __importDefault(require("./parsers/parse-potree-bin"));
/**
 * Loader for potree Binary Point Attributes
 * */
// @ts-ignore
exports.PotreeBinLoader = {
    name: 'potree Binary Point Attributes',
    id: 'potree',
    extensions: ['bin'],
    mimeTypes: ['application/octet-stream'],
    // Unfortunately binary potree files have no header bytes, no test possible
    // test: ['...'],
    parseSync,
    binary: true
};
function parseSync(arrayBuffer, options) {
    const index = {};
    const byteOffset = 0;
    (0, parse_potree_bin_1.default)(arrayBuffer, byteOffset, options, index);
    return index;
}
