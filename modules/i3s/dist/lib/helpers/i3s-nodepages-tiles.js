"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loaders.gl/core");
const textures_1 = require("@loaders.gl/textures");
const i3s_node_page_loader_1 = require("../../i3s-node-page-loader");
const parse_i3s_1 = require("../parsers/parse-i3s");
const url_utils_1 = require("../utils/url-utils");
/**
 * class I3SNodePagesTiles - loads nodePages and form i3s tiles from them
 */
class I3SNodePagesTiles {
    /**
     * @constructs
     * Create a I3SNodePagesTiles instance.
     * @param tileset - i3s tileset header ('layers/0')
     * @param options - i3s loader options
     */
    constructor(tileset, options) {
        this.nodePages = [];
        this.pendingNodePages = [];
        this.textureDefinitionsSelectedFormats = [];
        this.textureLoaderOptions = {};
        this.tileset = { ...tileset }; // spread the tileset to avoid circular reference
        this.nodesPerPage = tileset.nodePages?.nodesPerPage || 64;
        this.lodSelectionMetricType = tileset.nodePages?.lodSelectionMetricType;
        this.options = options;
        this.nodesInNodePages = 0;
        this.initSelectedFormatsForTextureDefinitions(tileset);
    }
    /**
     * Loads some nodePage and return a particular node from it
     * @param id - id of node through all node pages
     */
    async getNodeById(id) {
        const pageIndex = Math.floor(id / this.nodesPerPage);
        if (!this.nodePages[pageIndex] && !this.pendingNodePages[pageIndex]) {
            const nodePageUrl = (0, url_utils_1.getUrlWithToken)(`${this.tileset.url}/nodepages/${pageIndex}`, 
            // @ts-expect-error this.options is not properly typed
            this.options.i3s?.token);
            this.pendingNodePages[pageIndex] = {
                status: 'Pending',
                promise: (0, core_1.load)(nodePageUrl, i3s_node_page_loader_1.I3SNodePageLoader, this.options)
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
    /**
     * Forms tile header using node and tileset data
     * @param id - id of node through all node pages
     */
    // eslint-disable-next-line complexity, max-statements
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
            // Get geometry resource URL and type (compressed / non-compressed)
            const { url, isDracoGeometry: isDracoGeometryResult } = (node.mesh.geometry &&
                this.getContentUrl(node.mesh.geometry)) || { isDracoGeometry: false };
            contentUrl = url;
            isDracoGeometry = isDracoGeometryResult;
            const { textureData, materialDefinition: nodeMaterialDefinition } = this.getInformationFromMaterial(node.mesh.material);
            materialDefinition = nodeMaterialDefinition;
            textureFormat = textureData.format || textureFormat;
            if (textureData.name) {
                textureUrl = `${this.tileset.url}/nodes/${node.mesh.material.resource}/textures/${textureData.name}`;
            }
            if (this.tileset.attributeStorageInfo) {
                attributeUrls = (0, url_utils_1.generateTilesetAttributeUrls)(this.tileset, node.mesh.attribute.resource);
            }
        }
        const lodSelection = this.getLodSelection(node);
        return (0, parse_i3s_1.normalizeTileNonUrlData)({
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
    /**
     * Forms url and type of geometry resource by nodepage's data and `geometryDefinitions` in the tileset
     * @param - data about the node's mesh from the nodepage
     * @returns -
     *   {string} url - url to the geometry resource
     *   {boolean} isDracoGeometry - whether the geometry resource contain DRACO compressed geometry
     */
    getContentUrl(meshGeometryData) {
        let result = null;
        // @ts-ignore
        const geometryDefinition = this.tileset.geometryDefinitions[meshGeometryData.definition];
        let geometryIndex = -1;
        // Try to find DRACO geometryDefinition of `useDracoGeometry` option is set
        // @ts-expect-error this.options is not properly typed
        if (this.options.i3s && this.options.i3s.useDracoGeometry) {
            geometryIndex = geometryDefinition.geometryBuffers.findIndex((buffer) => buffer.compressedAttributes && buffer.compressedAttributes.encoding === 'draco');
        }
        // If DRACO geometry is not applicable try to select non-compressed geometry
        if (geometryIndex === -1) {
            geometryIndex = geometryDefinition.geometryBuffers.findIndex((buffer) => !buffer.compressedAttributes);
        }
        if (geometryIndex !== -1) {
            const isDracoGeometry = Boolean(geometryDefinition.geometryBuffers[geometryIndex].compressedAttributes);
            result = {
                url: `${this.tileset.url}/nodes/${meshGeometryData.resource}/geometries/${geometryIndex}`,
                isDracoGeometry
            };
        }
        return result;
    }
    /**
     * Forms 1.6 compatible LOD selection object from a nodepage's node data
     * @param node - a node from nodepage
     * @returns- Array of LodSelection
     */
    getLodSelection(node) {
        const lodSelection = [];
        if (this.lodSelectionMetricType === 'maxScreenThresholdSQ') {
            lodSelection.push({
                metricType: 'maxScreenThreshold',
                // @ts-ignore
                maxError: Math.sqrt(node.lodThreshold / (Math.PI * 0.25))
            });
        }
        lodSelection.push({
            metricType: this.lodSelectionMetricType,
            // @ts-ignore
            maxError: node.lodThreshold
        });
        return lodSelection;
    }
    /**
     * Returns information about texture and material from `materialDefinitions`
     * @param material - material data from nodepage
     * @returns - Couple {textureData, materialDefinition}
     * {string} textureData.name - path name of the texture
     * {string} textureData.format - format of the texture
     * materialDefinition - PBR-like material definition from `materialDefinitions`
     */
    getInformationFromMaterial(material) {
        const informationFromMaterial = { textureData: { name: null } };
        if (material) {
            const materialDefinition = this.tileset.materialDefinitions?.[material.definition];
            if (materialDefinition) {
                informationFromMaterial.materialDefinition = materialDefinition;
                const textureSetDefinitionIndex = materialDefinition?.pbrMetallicRoughness?.baseColorTexture?.textureSetDefinitionId;
                if (typeof textureSetDefinitionIndex === 'number') {
                    informationFromMaterial.textureData =
                        this.textureDefinitionsSelectedFormats[textureSetDefinitionIndex] ||
                            informationFromMaterial.textureData;
                }
            }
        }
        return informationFromMaterial;
    }
    /**
     * Sets preferable and supported format for each textureDefinition of the tileset
     * @param tileset - I3S layer data
     * @returns
     */
    initSelectedFormatsForTextureDefinitions(tileset) {
        this.textureDefinitionsSelectedFormats = [];
        const possibleI3sFormats = this.getSupportedTextureFormats();
        const textureSetDefinitions = tileset.textureSetDefinitions || [];
        for (const textureSetDefinition of textureSetDefinitions) {
            const formats = (textureSetDefinition && textureSetDefinition.formats) || [];
            let selectedFormat = null;
            for (const i3sFormat of possibleI3sFormats) {
                const format = formats.find((value) => value.format === i3sFormat);
                if (format) {
                    selectedFormat = format;
                    break;
                }
            }
            // For I3S 1.8 need to define basis target format to decode
            if (selectedFormat && selectedFormat.format === 'ktx2') {
                this.textureLoaderOptions.basis = {
                    format: (0, textures_1.selectSupportedBasisFormat)(),
                    containerFormat: 'ktx2',
                    module: 'encoder'
                };
            }
            this.textureDefinitionsSelectedFormats.push(selectedFormat);
        }
    }
    /**
     * Returns the array of supported texture format
     * @returns list of format strings
     */
    getSupportedTextureFormats() {
        const formats = [];
        // @ts-expect-error this.options is not properly typed
        if (!this.options.i3s || this.options.i3s.useCompressedTextures) {
            // I3S 1.7 selection
            const supportedCompressedFormats = (0, textures_1.getSupportedGPUTextureFormats)();
            // List of possible in i3s formats:
            // https://github.com/Esri/i3s-spec/blob/master/docs/1.7/textureSetDefinitionFormat.cmn.md
            if (supportedCompressedFormats.has('etc2')) {
                formats.push('ktx-etc2');
            }
            if (supportedCompressedFormats.has('dxt')) {
                formats.push('dds');
            }
            // I3S 1.8 selection
            // ktx2 wraps basis texture which at the edge case can be decoded as uncompressed image
            formats.push('ktx2');
        }
        formats.push('jpg');
        formats.push('png');
        return formats;
    }
}
exports.default = I3SNodePagesTiles;
