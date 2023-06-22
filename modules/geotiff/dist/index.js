"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TiffPixelSource = exports.loadGeoTiff = void 0;
var load_geotiff_1 = require("./lib/load-geotiff");
Object.defineProperty(exports, "loadGeoTiff", { enumerable: true, get: function () { return load_geotiff_1.loadGeoTiff; } });
var tiff_pixel_source_1 = require("./lib/tiff-pixel-source");
Object.defineProperty(exports, "TiffPixelSource", { enumerable: true, get: function () { return __importDefault(tiff_pixel_source_1).default; } });
