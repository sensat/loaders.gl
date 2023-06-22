import { JSONLoader, load } from '@loaders.gl/core';
const SUPPORTED_WKID = 4326;
const ARCGIS_SCENE_SERVER_LAYER_TYPE = 'ArcGISSceneServiceLayer';
const BUILDING_SCENE_LAYER = 'BuildingSceneLayer';
const INTEGRATED_MESH_LAYER = 'IntegratedMeshLayer';
const GROUP_LAYER = 'GroupLayer';
const SUPPORTED_LAYERS_TYPES = [ARCGIS_SCENE_SERVER_LAYER_TYPE, INTEGRATED_MESH_LAYER, BUILDING_SCENE_LAYER, GROUP_LAYER];
const NO_AVAILABLE_SUPPORTED_LAYERS_ERROR = 'NO_AVAILABLE_SUPPORTED_LAYERS_ERROR';
const NOT_SUPPORTED_CRS_ERROR = 'NOT_SUPPORTED_CRS_ERROR';
export async function parseWebscene(data) {
  const layer0 = JSON.parse(new TextDecoder().decode(data));
  const {
    operationalLayers
  } = layer0;
  const {
    layers,
    unsupportedLayers
  } = await parseOperationalLayers(operationalLayers, true);
  if (!layers.length) {
    throw new Error(NO_AVAILABLE_SUPPORTED_LAYERS_ERROR);
  }
  return {
    header: layer0,
    layers,
    unsupportedLayers
  };
}
async function parseOperationalLayers(layersList, needToCheckCRS) {
  const layers = [];
  let unsupportedLayers = [];
  for (let index = 0; index < layersList.length; index++) {
    var _layer$layers;
    const layer = layersList[index];
    const isLayerSupported = SUPPORTED_LAYERS_TYPES.includes(layer.layerType);
    if (isLayerSupported) {
      if (needToCheckCRS && layer.layerType !== GROUP_LAYER) {
        await checkSupportedIndexCRS(layer);
        needToCheckCRS = false;
      }
      layers.push(layer);
    } else {
      unsupportedLayers.push(layer);
    }
    if ((_layer$layers = layer.layers) !== null && _layer$layers !== void 0 && _layer$layers.length) {
      const {
        layers: childLayers,
        unsupportedLayers: childUnsupportedLayers
      } = await parseOperationalLayers(layer.layers, needToCheckCRS);
      layer.layers = childLayers;
      unsupportedLayers = [...unsupportedLayers, ...childUnsupportedLayers];
    }
  }
  return {
    layers,
    unsupportedLayers
  };
}
async function checkSupportedIndexCRS(layer) {
  try {
    var _layerJson$spatialRef;
    const layerJson = await load(layer.url, JSONLoader);
    const wkid = layerJson === null || layerJson === void 0 ? void 0 : (_layerJson$spatialRef = layerJson.spatialReference) === null || _layerJson$spatialRef === void 0 ? void 0 : _layerJson$spatialRef.wkid;
    if (wkid !== SUPPORTED_WKID) {
      throw new Error(NOT_SUPPORTED_CRS_ERROR);
    }
  } catch (error) {
    throw error;
  }
}
//# sourceMappingURL=parse-arcgis-webscene.js.map