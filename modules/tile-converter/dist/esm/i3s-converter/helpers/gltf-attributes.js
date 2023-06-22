function getB3DMAttributesWithoutBufferView(attributes) {
  const attributesWithoutBufferView = {};
  for (const attributeName in attributes) {
    attributesWithoutBufferView[attributeName] = {
      value: attributes[attributeName].value
    };
  }
  return attributesWithoutBufferView;
}
export function prepareDataForAttributesConversion(tileContent) {
  var _tileContent$gltf, _tileContent$gltf$sce, _tileContent$gltf2, _tileContent$gltf2$sc, _tileContent$gltf2$sc2, _tileContent$gltf3, _tileContent$gltf4, _tileContent$gltf4$im;
  let nodes = ((_tileContent$gltf = tileContent.gltf) === null || _tileContent$gltf === void 0 ? void 0 : (_tileContent$gltf$sce = _tileContent$gltf.scene) === null || _tileContent$gltf$sce === void 0 ? void 0 : _tileContent$gltf$sce.nodes) || ((_tileContent$gltf2 = tileContent.gltf) === null || _tileContent$gltf2 === void 0 ? void 0 : (_tileContent$gltf2$sc = _tileContent$gltf2.scenes) === null || _tileContent$gltf2$sc === void 0 ? void 0 : (_tileContent$gltf2$sc2 = _tileContent$gltf2$sc[0]) === null || _tileContent$gltf2$sc2 === void 0 ? void 0 : _tileContent$gltf2$sc2.nodes) || ((_tileContent$gltf3 = tileContent.gltf) === null || _tileContent$gltf3 === void 0 ? void 0 : _tileContent$gltf3.nodes) || [];
  const images = ((_tileContent$gltf4 = tileContent.gltf) === null || _tileContent$gltf4 === void 0 ? void 0 : (_tileContent$gltf4$im = _tileContent$gltf4.images) === null || _tileContent$gltf4$im === void 0 ? void 0 : _tileContent$gltf4$im.map(imageObject => {
    var _imageObject$image;
    if (imageObject !== null && imageObject !== void 0 && (_imageObject$image = imageObject.image) !== null && _imageObject$image !== void 0 && _imageObject$image.compressed) {
      return null;
    } else {
      var _imageObject$image2;
      const data = imageObject === null || imageObject === void 0 ? void 0 : (_imageObject$image2 = imageObject.image) === null || _imageObject$image2 === void 0 ? void 0 : _imageObject$image2.data;
      const dataCopy = new Uint8Array(data.length);
      dataCopy.set(data);
      return {
        data: dataCopy,
        compressed: false,
        height: imageObject.image.height,
        width: imageObject.image.width,
        components: imageObject.image.components,
        mimeType: imageObject.mimeType
      };
    }
  })) || [];
  prepareNodes(nodes);
  const cartographicOrigin = tileContent.cartographicOrigin;
  const cartesianModelMatrix = tileContent.cartesianModelMatrix;
  return {
    nodes,
    images,
    cartographicOrigin,
    cartesianModelMatrix
  };
}
function prepareNodes(nodes) {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];
    if (node.mesh) {
      var _node$mesh;
      nodes[index] = {
        ...node,
        mesh: {
          ...node.mesh,
          primitives: (_node$mesh = node.mesh) === null || _node$mesh === void 0 ? void 0 : _node$mesh.primitives.map(primitive => {
            var _primitive$indices, _primitive$material, _primitive$material2;
            return {
              ...primitive,
              indices: {
                value: primitive === null || primitive === void 0 ? void 0 : (_primitive$indices = primitive.indices) === null || _primitive$indices === void 0 ? void 0 : _primitive$indices.value
              },
              attributes: getB3DMAttributesWithoutBufferView(primitive.attributes),
              material: {
                id: primitive === null || primitive === void 0 ? void 0 : (_primitive$material = primitive.material) === null || _primitive$material === void 0 ? void 0 : _primitive$material.id,
                uniqueId: primitive === null || primitive === void 0 ? void 0 : (_primitive$material2 = primitive.material) === null || _primitive$material2 === void 0 ? void 0 : _primitive$material2.uniqueId
              }
            };
          })
        }
      };
    }
    if (node.children) {
      prepareNodes(node.children);
    }
  }
}
//# sourceMappingURL=gltf-attributes.js.map