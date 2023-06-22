import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { load } from '@loaders.gl/core';
import { getSupportedGPUTextureFormats, selectSupportedBasisFormat } from '@loaders.gl/textures';
import { I3SNodePageLoader } from '../../i3s-node-page-loader';
import { normalizeTileNonUrlData } from '../parsers/parse-i3s';
import { getUrlWithToken, generateTilesetAttributeUrls } from '../utils/url-utils';
export default class I3SNodePagesTiles {
  constructor(tileset, options) {
    var _tileset$nodePages, _tileset$nodePages2;
    _defineProperty(this, "tileset", void 0);
    _defineProperty(this, "nodePages", []);
    _defineProperty(this, "pendingNodePages", []);
    _defineProperty(this, "nodesPerPage", void 0);
    _defineProperty(this, "options", void 0);
    _defineProperty(this, "lodSelectionMetricType", void 0);
    _defineProperty(this, "textureDefinitionsSelectedFormats", []);
    _defineProperty(this, "nodesInNodePages", void 0);
    _defineProperty(this, "textureLoaderOptions", {});
    this.tileset = {
      ...tileset
    };
    this.nodesPerPage = ((_tileset$nodePages = tileset.nodePages) === null || _tileset$nodePages === void 0 ? void 0 : _tileset$nodePages.nodesPerPage) || 64;
    this.lodSelectionMetricType = (_tileset$nodePages2 = tileset.nodePages) === null || _tileset$nodePages2 === void 0 ? void 0 : _tileset$nodePages2.lodSelectionMetricType;
    this.options = options;
    this.nodesInNodePages = 0;
    this.initSelectedFormatsForTextureDefinitions(tileset);
  }
  async getNodeById(id) {
    const pageIndex = Math.floor(id / this.nodesPerPage);
    if (!this.nodePages[pageIndex] && !this.pendingNodePages[pageIndex]) {
      var _this$options$i3s;
      const nodePageUrl = getUrlWithToken("".concat(this.tileset.url, "/nodepages/").concat(pageIndex), (_this$options$i3s = this.options.i3s) === null || _this$options$i3s === void 0 ? void 0 : _this$options$i3s.token);
      this.pendingNodePages[pageIndex] = {
        status: 'Pending',
        promise: load(nodePageUrl, I3SNodePageLoader, this.options)
      };
      this.nodePages[pageIndex] = await this.pendingNodePages[pageIndex].promise;
      this.nodesInNodePages += this.nodePages[pageIndex].nodes.length;
      this.pendingNodePages[pageIndex].status = 'Done';
    }
    if (this.pendingNodePages[pageIndex].status === 'Pending') {
      this.nodePages[pageIndex] = await this.pendingNodePages[pageIndex].promise;
    }
    const nodeIndex = id % this.nodesPerPage;
    return this.nodePages[pageIndex].nodes[nodeIndex];
  }
  async formTileFromNodePages(id) {
    const node = await this.getNodeById(id);
    const children = [];
    const childNodesPromises = [];
    for (const child of node.children || []) {
      childNodesPromises.push(this.getNodeById(child));
    }
    const childNodes = await Promise.all(childNodesPromises);
    for (const childNode of childNodes) {
      children.push({
        id: childNode.index.toString(),
        obb: childNode.obb
      });
    }
    let contentUrl;
    let textureUrl;
    let materialDefinition;
    let textureFormat = 'jpg';
    let attributeUrls = [];
    let isDracoGeometry = false;
    if (node && node.mesh) {
      const {
        url,
        isDracoGeometry: isDracoGeometryResult
      } = node.mesh.geometry && this.getContentUrl(node.mesh.geometry) || {
        isDracoGeometry: false
      };
      contentUrl = url;
      isDracoGeometry = isDracoGeometryResult;
      const {
        textureData,
        materialDefinition: nodeMaterialDefinition
      } = this.getInformationFromMaterial(node.mesh.material);
      materialDefinition = nodeMaterialDefinition;
      textureFormat = textureData.format || textureFormat;
      if (textureData.name) {
        textureUrl = "".concat(this.tileset.url, "/nodes/").concat(node.mesh.material.resource, "/textures/").concat(textureData.name);
      }
      if (this.tileset.attributeStorageInfo) {
        attributeUrls = generateTilesetAttributeUrls(this.tileset, node.mesh.attribute.resource);
      }
    }
    const lodSelection = this.getLodSelection(node);
    return normalizeTileNonUrlData({
      id: id.toString(),
      lodSelection,
      obb: node.obb,
      contentUrl,
      textureUrl,
      attributeUrls,
      materialDefinition,
      textureFormat,
      textureLoaderOptions: this.textureLoaderOptions,
      children,
      isDracoGeometry
    });
  }
  getContentUrl(meshGeometryData) {
    let result = null;
    const geometryDefinition = this.tileset.geometryDefinitions[meshGeometryData.definition];
    let geometryIndex = -1;
    if (this.options.i3s && this.options.i3s.useDracoGeometry) {
      geometryIndex = geometryDefinition.geometryBuffers.findIndex(buffer => buffer.compressedAttributes && buffer.compressedAttributes.encoding === 'draco');
    }
    if (geometryIndex === -1) {
      geometryIndex = geometryDefinition.geometryBuffers.findIndex(buffer => !buffer.compressedAttributes);
    }
    if (geometryIndex !== -1) {
      const isDracoGeometry = Boolean(geometryDefinition.geometryBuffers[geometryIndex].compressedAttributes);
      result = {
        url: "".concat(this.tileset.url, "/nodes/").concat(meshGeometryData.resource, "/geometries/").concat(geometryIndex),
        isDracoGeometry
      };
    }
    return result;
  }
  getLodSelection(node) {
    const lodSelection = [];
    if (this.lodSelectionMetricType === 'maxScreenThresholdSQ') {
      lodSelection.push({
        metricType: 'maxScreenThreshold',
        maxError: Math.sqrt(node.lodThreshold / (Math.PI * 0.25))
      });
    }
    lodSelection.push({
      metricType: this.lodSelectionMetricType,
      maxError: node.lodThreshold
    });
    return lodSelection;
  }
  getInformationFromMaterial(material) {
    const informationFromMaterial = {
      textureData: {
        name: null
      }
    };
    if (material) {
      var _this$tileset$materia;
      const materialDefinition = (_this$tileset$materia = this.tileset.materialDefinitions) === null || _this$tileset$materia === void 0 ? void 0 : _this$tileset$materia[material.definition];
      if (materialDefinition) {
        var _materialDefinition$p, _materialDefinition$p2;
        informationFromMaterial.materialDefinition = materialDefinition;
        const textureSetDefinitionIndex = materialDefinition === null || materialDefinition === void 0 ? void 0 : (_materialDefinition$p = materialDefinition.pbrMetallicRoughness) === null || _materialDefinition$p === void 0 ? void 0 : (_materialDefinition$p2 = _materialDefinition$p.baseColorTexture) === null || _materialDefinition$p2 === void 0 ? void 0 : _materialDefinition$p2.textureSetDefinitionId;
        if (typeof textureSetDefinitionIndex === 'number') {
          informationFromMaterial.textureData = this.textureDefinitionsSelectedFormats[textureSetDefinitionIndex] || informationFromMaterial.textureData;
        }
      }
    }
    return informationFromMaterial;
  }
  initSelectedFormatsForTextureDefinitions(tileset) {
    this.textureDefinitionsSelectedFormats = [];
    const possibleI3sFormats = this.getSupportedTextureFormats();
    const textureSetDefinitions = tileset.textureSetDefinitions || [];
    for (const textureSetDefinition of textureSetDefinitions) {
      const formats = textureSetDefinition && textureSetDefinition.formats || [];
      let selectedFormat = null;
      for (const i3sFormat of possibleI3sFormats) {
        const format = formats.find(value => value.format === i3sFormat);
        if (format) {
          selectedFormat = format;
          break;
        }
      }
      if (selectedFormat && selectedFormat.format === 'ktx2') {
        this.textureLoaderOptions.basis = {
          format: selectSupportedBasisFormat(),
          containerFormat: 'ktx2',
          module: 'encoder'
        };
      }
      this.textureDefinitionsSelectedFormats.push(selectedFormat);
    }
  }
  getSupportedTextureFormats() {
    const formats = [];
    if (!this.options.i3s || this.options.i3s.useCompressedTextures) {
      const supportedCompressedFormats = getSupportedGPUTextureFormats();
      if (supportedCompressedFormats.has('etc2')) {
        formats.push('ktx-etc2');
      }
      if (supportedCompressedFormats.has('dxt')) {
        formats.push('dds');
      }
      formats.push('ktx2');
    }
    formats.push('jpg');
    formats.push('png');
    return formats;
  }
}
//# sourceMappingURL=i3s-nodepages-tiles.js.map