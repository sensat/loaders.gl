"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerrainLoader = void 0;
const version_1 = require("./lib/utils/version");
/**
 * Worker loader for image encoded terrain
 */
exports.TerrainLoader = {
    name: 'Terrain',
    id: 'terrain',
    module: 'terrain',
    version: version_1.VERSION,
    worker: true,
    extensions: ['png', 'pngraw', 'jpg', 'jpeg', 'gif', 'webp', 'bmp'],
    mimeTypes: ['image/png', 'image/jpeg', 'image/gif', 'image/webp', 'image/bmp'],
    options: {
        terrain: {
            tesselator: 'auto',
            bounds: undefined,
            meshMaxError: 10,
            elevationDecoder: {
                rScaler: 1,
                gScaler: 0,
                bScaler: 0,
                offset: 0
            },
            skirtHeight: undefined
        }
    }
};
