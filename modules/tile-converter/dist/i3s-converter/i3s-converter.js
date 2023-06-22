"use strict";
// loaders.gl, MIT license
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@loaders.gl/core");
const tiles_1 = require("@loaders.gl/tiles");
const _3d_tiles_1 = require("@loaders.gl/3d-tiles");
const path_1 = require("path");
const uuid_1 = require("uuid");
const process_1 = __importDefault(require("process"));
const json_map_transform_1 = __importDefault(require("json-map-transform"));
const md5_1 = __importDefault(require("md5"));
const node_pages_1 = __importDefault(require("./helpers/node-pages"));
const file_utils_1 = require("../lib/utils/file-utils");
const compress_util_1 = require("../lib/utils/compress-util");
const statistic_utills_1 = require("../lib/utils/statistic-utills");
const geometry_converter_1 = __importStar(require("./helpers/geometry-converter"));
const coordinate_converter_1 = require("./helpers/coordinate-converter");
const create_scene_server_path_1 = require("./helpers/create-scene-server-path");
const lod_conversion_utils_1 = require("../lib/utils/lod-conversion-utils");
const pgm_loader_1 = require("../pgm-loader");
const layers_1 = require("./json-templates/layers");
const geometry_definitions_1 = require("./json-templates/geometry-definitions");
const shared_resources_1 = require("./json-templates/shared-resources");
const node_debug_1 = require("./helpers/node-debug");
const textures_1 = require("@loaders.gl/textures");
const images_1 = require("@loaders.gl/images");
const worker_utils_1 = require("@loaders.gl/worker-utils");
const draco_1 = require("@loaders.gl/draco");
const write_queue_1 = __importDefault(require("../lib/utils/write-queue"));
const i3s_attributes_worker_1 = require("../i3s-attributes-worker");
const constants_1 = require("../constants");
const feature_attributes_1 = require("./helpers/feature-attributes");
const node_index_document_1 = require("./helpers/node-index-document");
const ION_DEFAULT_TOKEN = process_1.default.env?.IonToken || // eslint-disable-line
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWMxMzcyYy0zZjJkLTQwODctODNlNi01MDRkZmMzMjIxOWIiLCJpZCI6OTYyMCwic2NvcGVzIjpbImFzbCIsImFzciIsImdjIl0sImlhdCI6MTU2Mjg2NjI3M30.1FNiClUyk00YH_nWfSGpiQAjR5V2OvREDq1PJ5QMjWQ'; // eslint-disable-line
const HARDCODED_NODES_PER_PAGE = 64;
const _3D_TILES = '3DTILES';
const _3D_OBJECT_LAYER_TYPE = '3DObject';
const REFRESH_TOKEN_TIMEOUT = 1800; // 30 minutes in seconds
const CESIUM_DATASET_PREFIX = 'https://';
// const FS_FILE_TOO_LARGE = 'ERR_FS_FILE_TOO_LARGE';
/**
 * Converter from 3d-tiles tileset to i3s layer
 */
class I3SConverter {
    constructor() {
        this.boundingVolumeWarnings = [];
        this.conversionStartTime = [0, 0];
        this.refreshTokenTime = [0, 0];
        this.sourceTileset = null;
        this.geoidHeightModel = null;
        this.Loader = _3d_tiles_1.Tiles3DLoader;
        this.workerSource = {};
        this.writeQueue = new write_queue_1.default();
        this.compressList = null;
        this.nodePages = new node_pages_1.default(file_utils_1.writeFile, HARDCODED_NODES_PER_PAGE, this);
        this.options = {};
        this.layers0Path = '';
        this.materialMap = new Map();
        this.materialDefinitions = [];
        this.geometryMap = new Map();
        this.geometryConfigs = [];
        this.vertexCounter = 0;
        this.layers0 = null;
        this.featuresHashArray = [];
        this.refinementCounter = {
            tilesCount: 0,
            tilesWithAddRefineCount: 0
        };
        this.validate = false;
        this.generateTextures = false;
        this.generateBoundingVolumes = false;
        this.layersHasTexture = false;
        this.compressList = null;
    }
    /**
     * Convert a 3d tileset
     * @param options
     * @param options.inputUrl the url to read the tileset from
     * @param options.outputPath the output filename
     * @param options.tilesetName the output name of the tileset
     * @param options.maxDepth The max tree depth of conversion
     * @param options.slpk Generate slpk (Scene Layer Packages) output file
     * @param options.sevenZipExe Location of 7z.exe archiver to create slpk on Windows
     * @param options.egmFilePath location of *.pgm file to convert heights from ellipsoidal to gravity-related format
     * @param options.token Token for Cesium ION tilesets authentication
     * @param options.draco Generate I3S 1.7 draco compressed geometries
     * @param options.validate -enable validation
     * @param options.generateTextures - generate alternative type of textures (to have non-compressed jpeg/png and compressed ktx2)
     * @param options.generateBoundingVolumes - generate bounding volumes from vertices coordinates instead of source tiles bounding volumes
     * @param options.instantNodeWriting - Keep created 3DNodeIndexDocument files on disk instead of memory. This option reduce memory usage but decelerates conversion speed
     */
    async convert(options) {
        if (core_1.isBrowser) {
            console.log(constants_1.BROWSER_ERROR_MESSAGE);
            return constants_1.BROWSER_ERROR_MESSAGE;
        }
        this.conversionStartTime = process_1.default.hrtime();
        const { tilesetName, slpk, egmFilePath, inputUrl, validate, outputPath, draco = true, sevenZipExe, maxDepth, token, generateTextures, generateBoundingVolumes, instantNodeWriting = false, mergeMaterials = true } = options;
        this.options = {
            maxDepth,
            slpk,
            sevenZipExe,
            egmFilePath,
            draco,
            token,
            inputUrl,
            instantNodeWriting,
            mergeMaterials
        };
        this.compressList = (this.options.instantNodeWriting && []) || null;
        this.validate = Boolean(validate);
        this.Loader = inputUrl.indexOf(CESIUM_DATASET_PREFIX) !== -1 ? _3d_tiles_1.CesiumIonLoader : _3d_tiles_1.Tiles3DLoader;
        this.generateTextures = Boolean(generateTextures);
        this.generateBoundingVolumes = Boolean(generateBoundingVolumes);
        this.writeQueue = new write_queue_1.default();
        this.writeQueue.startListening();
        console.log('Loading egm file...'); // eslint-disable-line
        this.geoidHeightModel = await (0, core_1.load)(egmFilePath, pgm_loader_1.PGMLoader);
        console.log('Loading egm file completed!'); // eslint-disable-line
        if (slpk) {
            this.nodePages.useWriteFunction(file_utils_1.writeFileForSlpk);
        }
        await this.loadWorkers();
        try {
            const preloadOptions = await this._fetchPreloadOptions();
            const tilesetOptions = {
                loadOptions: {
                    _nodeWorkers: true,
                    reuseWorkers: true,
                    basis: {
                        format: 'rgba32',
                        // We need to load local fs workers because nodejs can't load workers from the Internet
                        workerUrl: './modules/textures/dist/basis-worker-node.js'
                    },
                    // We need to load local fs workers because nodejs can't load workers from the Internet
                    draco: { workerUrl: './modules/draco/dist/draco-worker-node.js' }
                }
            };
            if (preloadOptions.headers) {
                tilesetOptions.loadOptions.fetch = { headers: preloadOptions.headers };
            }
            Object.assign(tilesetOptions, preloadOptions);
            const sourceTilesetJson = await (0, core_1.load)(inputUrl, this.Loader, tilesetOptions.loadOptions);
            // console.log(tilesetJson); // eslint-disable-line
            this.sourceTileset = new tiles_1.Tileset3D(sourceTilesetJson, tilesetOptions);
            await this._createAndSaveTileset(outputPath, tilesetName, sourceTilesetJson?.root?.boundingVolume?.region);
            await this._finishConversion({ slpk: Boolean(slpk), outputPath, tilesetName });
            return sourceTilesetJson;
        }
        catch (error) {
            throw error;
        }
        finally {
            // Clean up worker pools
            const workerFarm = worker_utils_1.WorkerFarm.getWorkerFarm({});
            workerFarm.destroy();
        }
    }
    /**
     * Convert and save the layer and embedded tiles
     * @param outputPath - path to save output data
     * @param tilesetName - new tileset path
     */
    async _createAndSaveTileset(outputPath, tilesetName, boundingVolumeRegion) {
        const tilesetPath = (0, path_1.join)(`${outputPath}`, `${tilesetName}`);
        // Removing the tilesetPath needed to exclude erroneous files after conversion
        try {
            await (0, file_utils_1.removeDir)(tilesetPath);
        }
        catch (e) {
            // do nothing
        }
        this.layers0Path = (0, path_1.join)(tilesetPath, 'SceneServer', 'layers', '0');
        this._formLayers0(tilesetName, boundingVolumeRegion);
        this.materialDefinitions = [];
        this.materialMap = new Map();
        const sourceRootTile = this.sourceTileset.root;
        const boundingVolumes = (0, coordinate_converter_1.createBoundingVolumes)(sourceRootTile, this.geoidHeightModel);
        await this.nodePages.push({
            index: 0,
            lodThreshold: 0,
            obb: boundingVolumes.obb,
            children: []
        });
        const rootNode = await node_index_document_1.NodeIndexDocument.createRootNode(boundingVolumes, this);
        await this._convertNodesTree(rootNode, sourceRootTile);
        this.layers0.materialDefinitions = this.materialDefinitions;
        // @ts-ignore
        this.layers0.geometryDefinitions = (0, json_map_transform_1.default)(this.geometryConfigs.map((config) => ({
            geometryConfig: { ...config, draco: this.options.draco }
        })), (0, geometry_definitions_1.GEOMETRY_DEFINITION)());
        if (this.layersHasTexture === false) {
            this.layers0.store.defaultGeometrySchema.ordering =
                this.layers0.store.defaultGeometrySchema.ordering.filter((attribute) => attribute !== 'uv0');
        }
        await this._writeLayers0();
        (0, create_scene_server_path_1.createSceneServerPath)(tilesetName, this.layers0, tilesetPath);
        for (const filePath of this.compressList || []) {
            await (0, compress_util_1.compressFileWithGzip)(filePath);
            await (0, file_utils_1.removeFile)(filePath);
        }
        await this.nodePages.save();
        await this.writeQueue.finalize();
        await this._createSlpk(tilesetPath);
    }
    /**
     * Form object of 3DSceneLayer https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DSceneLayer.cmn.md
     * @param  tilesetName - Name of layer
     */
    _formLayers0(tilesetName, boundingVolumeRegion) {
        const fullExtent = (0, coordinate_converter_1.convertBoundingVolumeToI3SFullExtent)(this.sourceTileset?.boundingVolume || this.sourceTileset?.root?.boundingVolume);
        if (boundingVolumeRegion) {
            fullExtent.zmin = boundingVolumeRegion[4];
            fullExtent.zmax = boundingVolumeRegion[5];
        }
        const extent = [fullExtent.xmin, fullExtent.ymin, fullExtent.xmax, fullExtent.ymax];
        const layers0data = {
            version: `{${(0, uuid_1.v4)().toUpperCase()}}`,
            id: 0,
            name: tilesetName,
            href: './layers/0',
            store: {
                id: `{${(0, uuid_1.v4)().toUpperCase()}}`,
                extent
            },
            nodePages: {
                nodesPerPage: HARDCODED_NODES_PER_PAGE
            },
            compressGeometry: this.options.draco,
            fullExtent
        };
        this.layers0 = (0, json_map_transform_1.default)(layers0data, (0, layers_1.LAYERS)());
    }
    /**
     * Form object of 3DSceneLayer https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DSceneLayer.cmn.md
     * @param rootNode - 3DNodeIndexDocument of root node https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md
     * @param sourceRootTile - Source (3DTile) tile data
     */
    async _convertNodesTree(rootNode, sourceRootTile) {
        await this.sourceTileset._loadTile(sourceRootTile);
        if (this.isContentSupported(sourceRootTile)) {
            const childNodes = await this._createNode(rootNode, sourceRootTile, 0);
            for (const childNode of childNodes) {
                await childNode.save();
            }
            await rootNode.addChildren(childNodes);
        }
        else {
            await this._addChildrenWithNeighborsAndWriteFile({
                parentNode: rootNode,
                sourceTiles: sourceRootTile.children,
                level: 1
            });
        }
        await sourceRootTile.unloadContent();
        await rootNode.save();
    }
    /**
     * Write 3DSceneLayer https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DSceneLayer.cmn.md in file
     */
    async _writeLayers0() {
        if (this.options.slpk) {
            await this.writeQueue.enqueue({
                archiveKey: '3dSceneLayer.json.gz',
                writePromise: () => (0, file_utils_1.writeFileForSlpk)(this.layers0Path, JSON.stringify(this.layers0), '3dSceneLayer.json')
            });
        }
        else {
            await this.writeQueue.enqueue({
                writePromise: () => (0, file_utils_1.writeFile)(this.layers0Path, JSON.stringify(this.layers0))
            });
        }
    }
    /**
     * Pack files into *.slpk archive
     * @param tilesetPath - Path to save file
     */
    async _createSlpk(tilesetPath) {
        if (this.options.slpk) {
            const slpkTilesetPath = (0, path_1.join)(tilesetPath, 'SceneServer', 'layers', '0');
            const slpkFileName = `${tilesetPath}.slpk`;
            await (0, compress_util_1.compressWithChildProcess)(slpkTilesetPath, slpkFileName, 0, '.', this.options.sevenZipExe);
            // TODO: `addFileToZip` corrupts archive so it can't be validated with windows i3s_converter.exe
            // const fileHash128Path = `${tilesetPath}/@specialIndexFileHASH128@`;
            // try {
            //   await generateHash128FromZip(slpkFileName, fileHash128Path);
            //   await addFileToZip(
            //     tilesetPath,
            //     '@specialIndexFileHASH128@',
            //     slpkFileName,
            //     this.options.sevenZipExe
            //   );
            // } catch (error) {
            //   if (error.code === FS_FILE_TOO_LARGE) {
            //     console.warn(`${slpkFileName} file is too big to generate a hash`); // eslint-disable-line
            //   } else {
            //     console.error(error); // eslint-disable-line
            //   }
            // }
            // All converted files are contained in slpk now they can be deleted
            try {
                await (0, file_utils_1.removeDir)(tilesetPath);
            }
            catch (e) {
                // do nothing
            }
        }
    }
    /**
     * Add child nodes recursively and write them to files
     * @param data - arguments
     * @param data.parentNode - 3DNodeIndexDocument of parent node
     * @param data.sourceTiles - array of source child nodes
     * @param data.level - level of node (distanse to root node in the tree)
     */
    async _addChildrenWithNeighborsAndWriteFile(data) {
        await this._addChildren(data);
        await data.parentNode.addNeighbors();
    }
    /**
     * Convert nested subtree of 3DTiles dataset
     * @param param0
     * @param data.parentNode - 3DNodeIndexDocument of parent node
     * @param param0.sourceTile - source 3DTile data
     * @param param0.level - tree level
     */
    async convertNestedTileset({ parentNode, sourceTile, level }) {
        await this.sourceTileset._loadTile(sourceTile);
        await this._addChildren({
            parentNode,
            sourceTiles: sourceTile.children,
            level: level + 1
        });
        await sourceTile.unloadContent();
    }
    /**
     * Convert 3DTiles tile to I3S node
     * @param param0
     * @param param0.parentNode - 3DNodeIndexDocument of parent node
     * @param param0.sourceTile - source 3DTile data
     * @param param0.level - tree level
     */
    async convertNode({ parentNode, sourceTile, level }) {
        const childNodes = await this._createNode(parentNode, sourceTile, level);
        await parentNode.addChildren(childNodes);
    }
    /**
     * Add child nodes recursively and write them to files
     * @param param0 - arguments
     * @param param0.parentNode - 3DNodeIndexDocument of parent node
     * @param param0.sourceTile - source 3DTile data
     * @param param0.level - tree level
     */
    async _addChildren(data) {
        const { sourceTiles, parentNode, level } = data;
        if (this.options.maxDepth && level > this.options.maxDepth) {
            return;
        }
        for (const sourceTile of sourceTiles) {
            if (sourceTile.type === 'json') {
                await this.convertNestedTileset({ parentNode, sourceTile, level });
            }
            else {
                await this.convertNode({ parentNode, sourceTile, level });
            }
            if (sourceTile.id) {
                console.log(sourceTile.id); // eslint-disable-line
            }
        }
    }
    /**
     * Convert tile to one or more I3S nodes
     * @param parentNode - 3DNodeIndexDocument of parent node
     * @param sourceTile - source 3DTile data
     * @param level - tree level
     */
    async _createNode(parentNode, sourceTile, level) {
        this._checkAddRefinementTypeForTile(sourceTile);
        await this._updateTilesetOptions();
        await this.sourceTileset._loadTile(sourceTile);
        let boundingVolumes = (0, coordinate_converter_1.createBoundingVolumes)(sourceTile, this.geoidHeightModel);
        const propertyTable = (0, geometry_converter_1.getPropertyTable)(sourceTile.content);
        if (propertyTable && !this.layers0?.attributeStorageInfo?.length) {
            this._convertPropertyTableToNodeAttributes(propertyTable);
        }
        const resourcesData = await this._convertResources(sourceTile, parentNode.inPageId, propertyTable);
        const nodes = [];
        const nodeIds = [];
        const nodesInPage = [];
        const emptyResources = {
            geometry: null,
            compressedGeometry: null,
            texture: null,
            hasUvRegions: false,
            sharedResources: null,
            meshMaterial: null,
            vertexCount: null,
            attributes: null,
            featureCount: null,
            boundingVolumes: null
        };
        for (const resources of resourcesData || [emptyResources]) {
            this.layersHasTexture = this.layersHasTexture || Boolean(resources.texture);
            if (this.generateBoundingVolumes && resources.boundingVolumes) {
                boundingVolumes = resources.boundingVolumes;
            }
            const lodSelection = (0, lod_conversion_utils_1.convertGeometricErrorToScreenThreshold)(sourceTile, boundingVolumes);
            const maxScreenThresholdSQ = lodSelection.find((val) => val.metricType === 'maxScreenThresholdSQ') || { maxError: 0 };
            const nodeInPage = await this._updateNodeInNodePages(maxScreenThresholdSQ, boundingVolumes, sourceTile, parentNode.inPageId, resources);
            const nodeData = await node_index_document_1.NodeIndexDocument.createNodeIndexDocument(parentNode, boundingVolumes, lodSelection, nodeInPage, resources);
            const node = await new node_index_document_1.NodeIndexDocument(nodeInPage.index, this).addData(nodeData);
            nodes.push(node);
            if (nodeInPage.mesh) {
                await this._writeResources(resources, node.id);
            }
            if (this.validate) {
                this.boundingVolumeWarnings = (0, node_debug_1.validateNodeBoundingVolumes)(nodeData);
                if (this.boundingVolumeWarnings && this.boundingVolumeWarnings.length) {
                    console.warn('Bounding Volume Warnings: ', ...this.boundingVolumeWarnings); //eslint-disable-line
                }
            }
            nodeIds.push(nodeInPage.index);
            nodesInPage.push(nodeInPage);
        }
        sourceTile.unloadContent();
        await this._addChildrenWithNeighborsAndWriteFile({
            parentNode: nodes[0],
            sourceTiles: sourceTile.children,
            level: level + 1
        });
        return nodes;
    }
    /**
     * Convert tile to one or more I3S nodes
     * @param sourceTile - source tile (3DTile)
     * @param parentId - id of parent node in node pages
     * @param propertyTable - batch table from b3dm / feature properties from EXT_FEATURE_METADATA
     * @returns - converted node resources
     */
    async _convertResources(sourceTile, parentId, propertyTable) {
        if (!this.isContentSupported(sourceTile)) {
            return null;
        }
        const draftObb = {
            center: [],
            halfSize: [],
            quaternion: []
        };
        const resourcesData = await (0, geometry_converter_1.default)(sourceTile.content, async () => (await this.nodePages.push({ index: 0, obb: draftObb }, parentId)).index, propertyTable, this.featuresHashArray, this.layers0?.attributeStorageInfo, this.options.draco, this.generateBoundingVolumes, this.options.mergeMaterials, this.geoidHeightModel, this.workerSource);
        return resourcesData;
    }
    /**
     * Update node object (https://github.com/Esri/i3s-spec/blob/master/docs/1.7/node.cmn.md)
     * in node pages (https://github.com/Esri/i3s-spec/blob/master/docs/1.7/nodePage.cmn.md)
     * @param maxScreenThresholdSQ - Level of Details (LOD) metric
     * @param boundingVolumes - Bounding volumes
     * @param sourceTile - source tile (3DTile)
     * @param parentId - id of parent node in node pages
     * @param resources - the node resources data
     * @param resources.meshMaterial - PBR-like material object
     * @param resources.texture - texture image
     * @param resources.vertexCount - number of vertices in geometry
     * @param resources.featureCount - number of features
     * @param resources.geometry - Uint8Array with geometry attributes
     * @return the node object in node pages
     */
    async _updateNodeInNodePages(maxScreenThresholdSQ, boundingVolumes, sourceTile, parentId, resources) {
        const { meshMaterial, texture, vertexCount, featureCount, geometry, hasUvRegions } = resources;
        const nodeInPage = {
            index: 0,
            lodThreshold: maxScreenThresholdSQ.maxError,
            obb: boundingVolumes.obb,
            children: []
        };
        if (geometry && this.isContentSupported(sourceTile)) {
            nodeInPage.mesh = {
                geometry: {
                    definition: this.findOrCreateGeometryDefinition(Boolean(texture), hasUvRegions),
                    resource: 0
                },
                attribute: {
                    resource: 0
                },
                material: {
                    definition: 0
                }
            };
        }
        let nodeId = resources.nodeId;
        let node;
        if (!nodeId) {
            node = await this.nodePages.push(nodeInPage, parentId);
        }
        else {
            node = await this.nodePages.getNodeById(nodeId);
        }
        node_pages_1.default.updateAll(node, nodeInPage);
        if (meshMaterial) {
            node_pages_1.default.updateMaterialByNodeId(node, this._findOrCreateMaterial(meshMaterial));
        }
        if (texture) {
            const texelCountHint = texture.image.height * texture.image.width;
            node_pages_1.default.updateTexelCountHintByNodeId(node, texelCountHint);
        }
        if (vertexCount) {
            this.vertexCounter += vertexCount;
            node_pages_1.default.updateVertexCountByNodeId(node, vertexCount);
        }
        node_pages_1.default.updateNodeAttributeByNodeId(node);
        if (featureCount) {
            node_pages_1.default.updateFeatureCountByNodeId(node, featureCount);
        }
        this.nodePages.saveNode(node);
        return node;
    }
    /**
     * Write node resources in files
     * @param resources - source tile (3DTile)
     * @param resources.geometry - Uint8Array with geometry attributes
     * @param resources.compressedGeometry - Uint8Array with compressed (draco) geometry
     * @param resources.texture - texture image
     * @param resources.sharedResources - shared resource data object
     * @param resources.attributes - feature attributes
     * @return {Promise<void>}
     */
    async _writeResources(resources, nodePath) {
        const { geometry: geometryBuffer, compressedGeometry, texture, sharedResources, attributes } = resources;
        const childPath = (0, path_1.join)(this.layers0Path, 'nodes', nodePath);
        const slpkChildPath = (0, path_1.join)('nodes', nodePath);
        await this._writeGeometries(geometryBuffer, compressedGeometry, childPath, slpkChildPath);
        await this._writeShared(sharedResources, childPath, slpkChildPath, nodePath);
        await this._writeTexture(texture, childPath, slpkChildPath);
        await this._writeAttributes(attributes, childPath, slpkChildPath);
    }
    /**
     * Write non-compressed and compressed geometries in files
     * @param geometryBuffer - Uint8Array with geometry attributes
     * @param compressedGeometry - Uint8Array with compressed (draco) geometry
     * @param childPath - a child path to write resources
     * @param slpkChildPath - resource path inside *slpk file
     */
    async _writeGeometries(geometryBuffer, compressedGeometry, childPath, slpkChildPath) {
        if (this.options.slpk) {
            const slpkGeometryPath = (0, path_1.join)(childPath, 'geometries');
            await this.writeQueue.enqueue({
                archiveKey: `${slpkChildPath}/geometries/0.bin.gz`,
                writePromise: () => (0, file_utils_1.writeFileForSlpk)(slpkGeometryPath, geometryBuffer, '0.bin')
            });
        }
        else {
            const geometryPath = (0, path_1.join)(childPath, 'geometries/0/');
            await this.writeQueue.enqueue({
                writePromise: () => (0, file_utils_1.writeFile)(geometryPath, geometryBuffer, 'index.bin')
            });
        }
        if (this.options.draco) {
            if (this.options.slpk) {
                const slpkCompressedGeometryPath = (0, path_1.join)(childPath, 'geometries');
                await this.writeQueue.enqueue({
                    archiveKey: `${slpkChildPath}/geometries/1.bin.gz`,
                    writePromise: () => (0, file_utils_1.writeFileForSlpk)(slpkCompressedGeometryPath, compressedGeometry, '1.bin')
                });
            }
            else {
                const compressedGeometryPath = (0, path_1.join)(childPath, 'geometries/1/');
                await this.writeQueue.enqueue({
                    writePromise: () => (0, file_utils_1.writeFile)(compressedGeometryPath, compressedGeometry, 'index.bin')
                });
            }
        }
    }
    /**
     * Write shared resources in a file
     * @param sharedResources - shared resource data object
     * @param childPath - a child path to write resources
     * @param slpkChildPath - resource path inside *slpk file
     * @param nodePath - a node path
     */
    async _writeShared(sharedResources, childPath, slpkChildPath, nodePath) {
        if (!sharedResources) {
            return;
        }
        sharedResources.nodePath = nodePath;
        const sharedData = (0, json_map_transform_1.default)(sharedResources, (0, shared_resources_1.SHARED_RESOURCES)());
        const sharedDataStr = JSON.stringify(sharedData);
        if (this.options.slpk) {
            const slpkSharedPath = (0, path_1.join)(childPath, 'shared');
            await this.writeQueue.enqueue({
                archiveKey: `${slpkChildPath}/shared/sharedResource.json.gz`,
                writePromise: () => (0, file_utils_1.writeFileForSlpk)(slpkSharedPath, sharedDataStr, 'sharedResource.json')
            });
        }
        else {
            const sharedPath = (0, path_1.join)(childPath, 'shared/');
            await this.writeQueue.enqueue({ writePromise: () => (0, file_utils_1.writeFile)(sharedPath, sharedDataStr) });
        }
    }
    /**
     * Generates textures based on texture mime type and fill in textureSetDefinitions data.
     * @param texture - the texture image
     * @param childPath - a child path to write resources
     * @param slpkChildPath - the resource path inside *slpk file
     */
    async _writeTexture(texture, childPath, slpkChildPath) {
        if (texture) {
            const format = this._getFormatByMimeType(texture?.mimeType);
            const formats = [];
            const textureData = texture.bufferView.data;
            switch (format) {
                case 'jpg':
                case 'png': {
                    formats.push({ name: '0', format });
                    await this.writeTextureFile(textureData, '0', format, childPath, slpkChildPath);
                    if (this.generateTextures) {
                        formats.push({ name: '1', format: 'ktx2' });
                        // For Node.js texture.image.data is type of Buffer
                        const copyArrayBuffer = texture.image.data.subarray();
                        const arrayToEncode = new Uint8Array(copyArrayBuffer);
                        const ktx2TextureData = (0, core_1.encode)({ ...texture.image, data: arrayToEncode }, textures_1.KTX2BasisWriterWorker, {
                            ...textures_1.KTX2BasisWriterWorker.options,
                            source: this.workerSource.ktx2,
                            reuseWorkers: true,
                            _nodeWorkers: true
                        });
                        await this.writeTextureFile(ktx2TextureData, '1', 'ktx2', childPath, slpkChildPath);
                    }
                    break;
                }
                case 'ktx2': {
                    formats.push({ name: '1', format });
                    await this.writeTextureFile(textureData, '1', format, childPath, slpkChildPath);
                    if (this.generateTextures) {
                        formats.push({ name: '0', format: 'jpg' });
                        const decodedFromKTX2TextureData = (0, core_1.encode)(texture.image.data[0], images_1.ImageWriter);
                        await this.writeTextureFile(decodedFromKTX2TextureData, '0', 'jpg', childPath, slpkChildPath);
                    }
                }
            }
            if (!this.layers0.textureSetDefinitions.length) {
                this.layers0.textureSetDefinitions.push({ formats });
                this.layers0.textureSetDefinitions.push({ formats, atlas: true });
            }
        }
    }
    /**
     * Write the texture image in a file
     * @param textureData
     * @param name
     * @param format
     * @param childPath
     * @param slpkChildPath
     */
    async writeTextureFile(textureData, name, format, childPath, slpkChildPath) {
        if (this.options.slpk) {
            const slpkTexturePath = (0, path_1.join)(childPath, 'textures');
            const compress = false;
            await this.writeQueue.enqueue({
                archiveKey: `${slpkChildPath}/textures/${name}.${format}`,
                writePromise: () => (0, file_utils_1.writeFileForSlpk)(slpkTexturePath, textureData, `${name}.${format}`, compress)
            });
        }
        else {
            const texturePath = (0, path_1.join)(childPath, `textures/${name}/`);
            await this.writeQueue.enqueue({
                writePromise: () => (0, file_utils_1.writeFile)(texturePath, textureData, `index.${format}`)
            });
        }
    }
    /**
     * Write feature attributes in files
     * @param attributes - feature attributes
     * @param childPath - a child path to write resources
     * @param slpkChildPath - the resource path inside *slpk file
     */
    async _writeAttributes(attributes = [], childPath, slpkChildPath) {
        if (attributes?.length && this.layers0?.attributeStorageInfo?.length) {
            for (let index = 0; index < attributes.length; index++) {
                const folderName = this.layers0.attributeStorageInfo[index].key;
                const fileBuffer = new Uint8Array(attributes[index]);
                if (this.options.slpk) {
                    const slpkAttributesPath = (0, path_1.join)(childPath, 'attributes', folderName);
                    await this.writeQueue.enqueue({
                        archiveKey: `${slpkChildPath}/attributes/${folderName}.bin.gz`,
                        writePromise: () => (0, file_utils_1.writeFileForSlpk)(slpkAttributesPath, fileBuffer, '0.bin')
                    });
                }
                else {
                    const attributesPath = (0, path_1.join)(childPath, `attributes/${folderName}/0`);
                    await this.writeQueue.enqueue({
                        writePromise: () => (0, file_utils_1.writeFile)(attributesPath, fileBuffer, 'index.bin')
                    });
                }
            }
        }
    }
    /**
     * Return file format by its MIME type
     * @param mimeType - feature attributes
     */
    _getFormatByMimeType(mimeType) {
        switch (mimeType) {
            case 'image/jpeg':
                return 'jpg';
            case 'image/png':
                return 'png';
            case 'image/ktx2':
                return 'ktx2';
            default:
                return 'jpg';
        }
    }
    /**
     * Find or create material in materialDefinitions array
     * @param material - end-to-end index of the node
     * @return material id
     */
    _findOrCreateMaterial(material) {
        const hash = (0, md5_1.default)(JSON.stringify(material));
        if (this.materialMap.has(hash)) {
            return this.materialMap.get(hash) || 0;
        }
        const newMaterialId = this.materialDefinitions.push(material) - 1;
        this.materialMap.set(hash, newMaterialId);
        return newMaterialId;
    }
    /**
     * Get unique geometry configuration index
     * In the end of conversion configurations will be transformed to geometryDefinitions array
     * @param hasTexture
     * @param hasUvRegions
     * @returns
     */
    findOrCreateGeometryDefinition(hasTexture, hasUvRegions) {
        const geometryConfig = { hasTexture, hasUvRegions };
        const hash = (0, md5_1.default)(JSON.stringify(geometryConfig));
        if (this.geometryMap.has(hash)) {
            return this.geometryMap.get(hash) || 0;
        }
        const newGeometryId = this.geometryConfigs.push(geometryConfig) - 1;
        this.geometryMap.set(hash, newGeometryId);
        return newGeometryId;
    }
    /**
     * Do conversion of 3DTiles property table to I3s node attributes.
     * @param propertyTable - Table with layer meta data.
     */
    _convertPropertyTableToNodeAttributes(propertyTable) {
        let attributeIndex = 0;
        const propertyTableWithObjectId = {
            OBJECTID: [0],
            ...propertyTable
        };
        for (const key in propertyTableWithObjectId) {
            const firstAttribute = propertyTableWithObjectId[key][0];
            const attributeType = (0, feature_attributes_1.getAttributeType)(key, firstAttribute);
            const storageAttribute = (0, feature_attributes_1.createdStorageAttribute)(attributeIndex, key, attributeType);
            const fieldAttributeType = (0, feature_attributes_1.getFieldAttributeType)(attributeType);
            const fieldAttribute = (0, feature_attributes_1.createFieldAttribute)(key, fieldAttributeType);
            const popupInfo = (0, feature_attributes_1.createPopupInfo)(propertyTableWithObjectId);
            this.layers0.attributeStorageInfo.push(storageAttribute);
            this.layers0.fields.push(fieldAttribute);
            this.layers0.popupInfo = popupInfo;
            this.layers0.layerType = _3D_OBJECT_LAYER_TYPE;
            attributeIndex += 1;
        }
    }
    /**
     * Print statistics in the end of conversion
     * @param params - output files data
     */
    async _finishConversion(params) {
        const { tilesCount, tilesWithAddRefineCount } = this.refinementCounter;
        const addRefinementPercentage = tilesWithAddRefineCount
            ? (tilesWithAddRefineCount / tilesCount) * 100
            : 0;
        const filesSize = await (0, statistic_utills_1.calculateFilesSize)(params);
        const diff = process_1.default.hrtime(this.conversionStartTime);
        const conversionTime = (0, statistic_utills_1.timeConverter)(diff);
        console.log(`------------------------------------------------`); // eslint-disable-line no-undef, no-console
        console.log(`Finishing conversion of ${_3D_TILES}`); // eslint-disable-line no-undef, no-console
        console.log(`Total conversion time: ${conversionTime}`); // eslint-disable-line no-undef, no-console
        console.log(`Vertex count: `, this.vertexCounter); // eslint-disable-line no-undef, no-console
        console.log(`File(s) size: `, filesSize, ' bytes'); // eslint-disable-line no-undef, no-console
        console.log(`Percentage of tiles with "ADD" refinement type:`, addRefinementPercentage, '%'); // eslint-disable-line no-undef, no-console
        console.log(`------------------------------------------------`); // eslint-disable-line no-undef, no-console
    }
    /**
     * Fetch preload options for ION tileset
     */
    async _fetchPreloadOptions() {
        if (!this.Loader.preload) {
            return {};
        }
        const options = {
            'cesium-ion': { accessToken: this.options.token || ION_DEFAULT_TOKEN }
        };
        const preloadOptions = await this.Loader.preload(this.options.inputUrl, options);
        this.refreshTokenTime = process_1.default.hrtime();
        return { ...options, ...preloadOptions };
    }
    /**
     * Update options of source tileset
     */
    async _updateTilesetOptions() {
        const diff = process_1.default.hrtime(this.refreshTokenTime);
        if (diff[0] < REFRESH_TOKEN_TIMEOUT) {
            return;
        }
        this.refreshTokenTime = process_1.default.hrtime();
        const preloadOptions = await this._fetchPreloadOptions();
        this.sourceTileset.options = { ...this.sourceTileset.options, ...preloadOptions };
        if (preloadOptions.headers) {
            this.sourceTileset.loadOptions.fetch = {
                ...this.sourceTileset.loadOptions.fetch,
                headers: preloadOptions.headers
            };
            console.log('Authorization Bearer token has been updated'); // eslint-disable-line no-undef, no-console
        }
    }
    /** Do calculations of all tiles and tiles with "ADD" type of refinement.
     * @param tile
     */
    _checkAddRefinementTypeForTile(tile) {
        const ADD_TILE_REFINEMENT = 1;
        if (tile.refine === ADD_TILE_REFINEMENT) {
            this.refinementCounter.tilesWithAddRefineCount += 1;
            console.warn('This tile uses "ADD" type of refinement'); // eslint-disable-line
        }
        this.refinementCounter.tilesCount += 1;
    }
    /**
     * Check if the tile's content format is supported by the converter
     * @param sourceRootTile
     * @returns
     */
    isContentSupported(sourceRootTile) {
        return ['b3dm', 'glTF'].includes(sourceRootTile?.content?.type);
    }
    async loadWorkers() {
        console.log(`Loading workers source...`); // eslint-disable-line no-undef, no-console
        if (this.options.draco) {
            const url = (0, worker_utils_1.getWorkerURL)(draco_1.DracoWriterWorker, { ...(0, core_1.getLoaderOptions)() });
            const sourceResponse = await (0, core_1.fetchFile)(url);
            const source = await sourceResponse.text();
            this.workerSource.draco = source;
        }
        if (this.generateTextures) {
            const url = (0, worker_utils_1.getWorkerURL)(textures_1.KTX2BasisWriterWorker, { ...(0, core_1.getLoaderOptions)() });
            const sourceResponse = await (0, core_1.fetchFile)(url);
            const source = await sourceResponse.text();
            this.workerSource.ktx2 = source;
        }
        const i3sAttributesWorkerUrl = (0, worker_utils_1.getWorkerURL)(i3s_attributes_worker_1.I3SAttributesWorker, { ...(0, core_1.getLoaderOptions)() });
        const sourceResponse = await (0, core_1.fetchFile)(i3sAttributesWorkerUrl);
        const source = await sourceResponse.text();
        this.workerSource.I3SAttributes = source;
        console.log(`Loading workers source completed!`); // eslint-disable-line no-undef, no-console
    }
}
exports.default = I3SConverter;
