"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseBuildingSceneLayer = void 0;
const OBJECT_3D_LAYER_TYPE = '3DObject';
/**
 * Parses Builiding Scene Layer and creates tileset
 * @param data
 * @param options
 * @param context
 */
async function parseBuildingSceneLayer(data, url) {
    const layer0 = JSON.parse(new TextDecoder().decode(data));
    const { sublayers } = layer0;
    return {
        header: layer0,
        sublayers: parseSublayersTree(sublayers, url)
    };
}
exports.parseBuildingSceneLayer = parseBuildingSceneLayer;
/**
 * Recursively parses Building Scene Layer sublayers.
 * @param sublayers
 * @param url
 */
function parseSublayersTree(sublayers, url) {
    let layers = [];
    for (let index = 0; index < sublayers.length; index++) {
        const subLayer = sublayers[index];
        const { id, layerType, visibility = true, ...rest } = subLayer;
        // Add support only for 3DObject layer type for I3S purposes.
        if (layerType === OBJECT_3D_LAYER_TYPE) {
            const sublayerUrl = `${url}/sublayers/${id}`;
            layers.push({
                url: sublayerUrl,
                id,
                layerType,
                visibility,
                ...rest
            });
        }
        if (subLayer?.sublayers?.length) {
            layers = [...layers, ...parseSublayersTree(subLayer.sublayers, url)];
        }
    }
    return layers;
}
