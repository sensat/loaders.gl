"use strict";
// POLYFILL: DOMParser
// - Node: Yes
// - Browser: No
Object.defineProperty(exports, "__esModule", { value: true });
exports.TCXLoader = exports.KMLLoader = exports.GPXLoader = void 0;
var gpx_loader_1 = require("./gpx-loader");
Object.defineProperty(exports, "GPXLoader", { enumerable: true, get: function () { return gpx_loader_1.GPXLoader; } });
var kml_loader_1 = require("./kml-loader");
Object.defineProperty(exports, "KMLLoader", { enumerable: true, get: function () { return kml_loader_1.KMLLoader; } });
var tcx_loader_1 = require("./tcx-loader");
Object.defineProperty(exports, "TCXLoader", { enumerable: true, get: function () { return tcx_loader_1.TCXLoader; } });
