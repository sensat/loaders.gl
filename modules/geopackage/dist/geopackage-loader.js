"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeoPackageLoader = void 0;
const parse_geopackage_1 = __importStar(require("./lib/parse-geopackage"));
// __VERSION__ is injected by babel-plugin-version-inline
// @ts-ignore TS2304: Cannot find name '__VERSION__'.
// const VERSION = typeof __VERSION__ !== 'undefined' ? __VERSION__ : 'latest';
const VERSION = 'latest';
/** Geopackage loader */
exports.GeoPackageLoader = {
    id: 'geopackage',
    name: 'GeoPackage',
    module: 'geopackage',
    version: VERSION,
    extensions: ['gpkg'],
    mimeTypes: ['application/geopackage+sqlite3'],
    category: 'geometry',
    parse: parse_geopackage_1.default,
    options: {
        geopackage: {
            sqlJsCDN: parse_geopackage_1.DEFAULT_SQLJS_CDN
        },
        gis: {
            format: 'tables'
        }
    }
};
