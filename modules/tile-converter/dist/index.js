"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tiles3DConverter = exports.I3SConverter = void 0;
var i3s_converter_1 = require("./i3s-converter/i3s-converter");
Object.defineProperty(exports, "I3SConverter", { enumerable: true, get: function () { return __importDefault(i3s_converter_1).default; } });
var _3d_tiles_converter_1 = require("./3d-tiles-converter/3d-tiles-converter");
Object.defineProperty(exports, "Tiles3DConverter", { enumerable: true, get: function () { return __importDefault(_3d_tiles_converter_1).default; } });
