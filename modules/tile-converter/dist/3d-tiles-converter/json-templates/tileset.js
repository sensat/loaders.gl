"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TILESET = void 0;
const json_map_transform_1 = __importDefault(require("json-map-transform"));
const ASSET = () => ({
    version: {
        path: 'version',
        default: '1.0'
    }
});
const TILE = () => ({
    boundingVolume: {
        path: 'boundingVolume'
    },
    geometricError: {
        path: 'geometricError'
    },
    content: {
        path: 'content'
    },
    children: {
        path: 'children',
        transform: (val) => val.map((tile) => (0, json_map_transform_1.default)(tile, TILE()))
    }
});
const TILESET = () => ({
    asset: {
        path: 'asset',
        transform: (val) => (0, json_map_transform_1.default)(val, ASSET())
    },
    geometricError: {
        path: 'root',
        transform: (val) => val.geometricError
    },
    root: {
        path: 'root',
        transform: (val) => (0, json_map_transform_1.default)(val, TILE())
    }
});
exports.TILESET = TILESET;
