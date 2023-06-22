const OBJECT_3D_LAYER_TYPE = '3DObject';
export async function parseBuildingSceneLayer(data, url) {
  const layer0 = JSON.parse(new TextDecoder().decode(data));
  const {
    sublayers
  } = layer0;
  return {
    header: layer0,
    sublayers: parseSublayersTree(sublayers, url)
  };
}
function parseSublayersTree(sublayers, url) {
  let layers = [];
  for (let index = 0; index < sublayers.length; index++) {
    var _subLayer$sublayers;
    const subLayer = sublayers[index];
    const {
      id,
      layerType,
      visibility = true,
      ...rest
    } = subLayer;
    if (layerType === OBJECT_3D_LAYER_TYPE) {
      const sublayerUrl = "".concat(url, "/sublayers/").concat(id);
      layers.push({
        url: sublayerUrl,
        id,
        layerType,
        visibility,
        ...rest
      });
    }
    if (subLayer !== null && subLayer !== void 0 && (_subLayer$sublayers = subLayer.sublayers) !== null && _subLayer$sublayers !== void 0 && _subLayer$sublayers.length) {
      layers = [...layers, ...parseSublayersTree(subLayer.sublayers, url)];
    }
  }
  return layers;
}
//# sourceMappingURL=parse-i3s-building-scene-layer.js.map