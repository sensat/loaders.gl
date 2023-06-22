"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const process_1 = __importDefault(require("process"));
const json_map_transform_1 = __importDefault(require("json-map-transform"));
const core_1 = require("@loaders.gl/core");
const i3s_1 = require("@loaders.gl/i3s");
const tiles_1 = require("@loaders.gl/tiles");
const pgm_loader_1 = require("../pgm-loader");
const i3s_obb_to_3d_tiles_obb_1 = require("./helpers/i3s-obb-to-3d-tiles-obb");
const lod_conversion_utils_1 = require("../lib/utils/lod-conversion-utils");
const file_utils_1 = require("../lib/utils/file-utils");
const statistic_utills_1 = require("../lib/utils/statistic-utills");
const tileset_1 = require("./json-templates/tileset");
const coordinate_converter_1 = require("../i3s-converter/helpers/coordinate-converter");
const _3d_tiles_attributes_worker_1 = require("../3d-tiles-attributes-worker");
const worker_utils_1 = require("@loaders.gl/worker-utils");
const constants_1 = require("../constants");
const I3S = 'I3S';
/**
 * Converter from i3s to 3d-tiles
 */
class Tiles3DConverter {
    constructor() {
        this.workerSource = {};
        this.options = {};
        this.tilesetPath = '';
        this.vertexCounter = 0;
        this.conversionStartTime = [0, 0];
        this.geoidHeightModel = null;
        this.sourceTileset = null;
        this.attributeStorageInfo = null;
        this.workerSource = {};
    }
    /**
     * Convert i3s format data to 3dTiles
     * @param options
     * @param options.inputUrl the url to read the tileset from
     * @param options.outputPath the output filename
     * @param options.tilesetName the output name of the tileset
     * @param options.egmFilePath location of *.pgm file to convert heights from ellipsoidal to gravity-related format
     * @param options.maxDepth The max tree depth of conversion
     */
    async convert(options) {
        if (core_1.isBrowser) {
            console.log(constants_1.BROWSER_ERROR_MESSAGE);
            return constants_1.BROWSER_ERROR_MESSAGE;
        }
        const { inputUrl, outputPath, tilesetName, maxDepth, egmFilePath } = options;
        this.conversionStartTime = process_1.default.hrtime();
        this.options = { maxDepth };
        console.log('Loading egm file...'); // eslint-disable-line
        this.geoidHeightModel = await (0, core_1.load)(egmFilePath, pgm_loader_1.PGMLoader);
        console.log('Loading egm file completed!'); // eslint-disable-line
        await this.loadWorkers();
        const sourceTilesetJson = await (0, core_1.load)(inputUrl, i3s_1.I3SLoader, {});
        this.sourceTileset = new tiles_1.Tileset3D(sourceTilesetJson, {
            loadOptions: {
                _nodeWorkers: true,
                reuseWorkers: true,
                i3s: { coordinateSystem: i3s_1.COORDINATE_SYSTEM.LNGLAT_OFFSETS, decodeTextures: false }
                // TODO should no longer be needed with new workers
                // 'i3s-content-nodejs': {
                //   workerUrl: './modules/i3s/dist/i3s-content-nodejs-worker.js'
                // }
            }
        });
        await this.sourceTileset.tilesetInitializationPromise;
        const rootNode = this.sourceTileset.root;
        if (!rootNode.header.obb) {
            rootNode.header.obb = (0, coordinate_converter_1.createObbFromMbs)(rootNode.header.mbs);
        }
        this.tilesetPath = (0, path_1.join)(`${outputPath}`, `${tilesetName}`);
        this.attributeStorageInfo = sourceTilesetJson.attributeStorageInfo;
        // Removing the tilesetPath needed to exclude erroneous files after conversion
        try {
            await (0, file_utils_1.removeDir)(this.tilesetPath);
        }
        catch (e) {
            // do nothing
        }
        const rootTile = {
            boundingVolume: {
                box: (0, i3s_obb_to_3d_tiles_obb_1.i3sObbTo3dTilesObb)(rootNode.header.obb, this.geoidHeightModel)
            },
            geometricError: (0, lod_conversion_utils_1.convertScreenThresholdToGeometricError)(rootNode),
            children: []
        };
        await this._addChildren(rootNode, rootTile, 1);
        const tileset = (0, json_map_transform_1.default)({ root: rootTile }, (0, tileset_1.TILESET)());
        await (0, file_utils_1.writeFile)(this.tilesetPath, JSON.stringify(tileset), 'tileset.json');
        this._finishConversion({ slpk: false, outputPath, tilesetName });
        // Clean up worker pools
        const workerFarm = worker_utils_1.WorkerFarm.getWorkerFarm({});
        workerFarm.destroy();
    }
    /**
     * Convert particular I3S Node
     * @param parentSourceNode the parent node tile object (@loaders.gl/tiles/Tile3D)
     * @param parentNode object in resulting tileset
     * @param level a current level of a tree depth
     * @param childNodeInfo child node to convert
     */
    async convertChildNode(parentSourceNode, parentNode, level, childNodeInfo) {
        const sourceChild = await this._loadChildNode(parentSourceNode, childNodeInfo);
        parentSourceNode.children.push(sourceChild);
        if (sourceChild.contentUrl) {
            await this.sourceTileset._loadTile(sourceChild);
            this.vertexCounter += sourceChild.content.vertexCount;
            let featureAttributes = null;
            if (this.attributeStorageInfo) {
                featureAttributes = await this._loadChildAttributes(sourceChild, this.attributeStorageInfo);
            }
            if (!sourceChild.header.obb) {
                sourceChild.header.obb = (0, coordinate_converter_1.createObbFromMbs)(sourceChild.header.mbs);
            }
            const boundingVolume = {
                box: (0, i3s_obb_to_3d_tiles_obb_1.i3sObbTo3dTilesObb)(sourceChild.header.obb, this.geoidHeightModel)
            };
            const child = {
                boundingVolume,
                geometricError: (0, lod_conversion_utils_1.convertScreenThresholdToGeometricError)(sourceChild),
                children: []
            };
            const i3sAttributesData = {
                tileContent: sourceChild.content,
                textureFormat: sourceChild?.header?.textureFormat
            };
            const b3dm = await (0, _3d_tiles_attributes_worker_1.transform3DTilesAttributesOnWorker)(i3sAttributesData, {
                source: this.workerSource.tile3dWorkerSource,
                featureAttributes
            });
            child.content = {
                uri: `${sourceChild.id}.b3dm`,
                boundingVolume
            };
            await (0, file_utils_1.writeFile)(this.tilesetPath, new Uint8Array(b3dm), `${sourceChild.id}.b3dm`);
            parentNode.children.push(child);
            sourceChild.unloadContent();
            await this._addChildren(sourceChild, child, level + 1);
        }
        else {
            await this._addChildren(sourceChild, parentNode, level + 1);
        }
    }
    /**
     * The recursive function of traversal of a nodes tree
     * @param parentSourceNode the parent node tile object (@loaders.gl/tiles/Tile3D)
     * @param parentNode object in resulting tileset
     * @param level a current level of a tree depth
     */
    async _addChildren(parentSourceNode, parentNode, level) {
        if (this.options.maxDepth && level > this.options.maxDepth) {
            return;
        }
        const promises = [];
        for (const childNodeInfo of parentSourceNode.header.children || []) {
            promises.push(this.convertChildNode(parentSourceNode, parentNode, level, childNodeInfo));
        }
        await Promise.all(promises);
    }
    /**
     * Load a child node having information from the node header
     * @param parentNode a parent node tile object (@loaders.gl/tiles/Tile3D)
     * @param childNodeInfo child information from 3DNodeIndexDocument
     *   (https://github.com/Esri/i3s-spec/blob/master/docs/1.7/nodeReference.cmn.md)
     */
    async _loadChildNode(parentNode, childNodeInfo) {
        let header;
        if (this.sourceTileset.tileset.nodePages) {
            console.log(`Node conversion: ${childNodeInfo.id}`); // eslint-disable-line no-console,no-undef
            header = await this.sourceTileset.tileset.nodePagesTile.formTileFromNodePages(childNodeInfo.id);
        }
        else {
            const { loader } = this.sourceTileset;
            const nodeUrl = this._relativeUrlToFullUrl(parentNode.url, childNodeInfo.href);
            // load metadata
            const options = {
                i3s: {
                    ...this.sourceTileset.loadOptions,
                    isTileHeader: true,
                    loadContent: false
                }
            };
            console.log(`Node conversion: ${nodeUrl}`); // eslint-disable-line no-console,no-undef
            header = await (0, core_1.load)(nodeUrl, loader, options);
        }
        return new tiles_1.Tile3D(this.sourceTileset, header, parentNode);
    }
    /**
     * Make an url of a resource from its relative url having the base url
     * @param baseUrl the base url. A resulting url will be related from this url
     * @param relativeUrl a realtive url of a resource
     */
    _relativeUrlToFullUrl(baseUrl, relativeUrl) {
        let resultArray = baseUrl.split('/');
        const relativeUrlArray = relativeUrl.split('/');
        for (const folder of relativeUrlArray) {
            switch (folder) {
                case '.':
                    continue; // eslint-disable-line no-continue
                case '..':
                    resultArray = resultArray.slice(0, -1);
                    break;
                default:
                    resultArray.push(folder);
            }
        }
        return resultArray.join('/');
    }
    /**
     * Do loading all attributes related to particular node.
     * @param sourceChild
     * @param attributeStorageInfo
     * @returns Promise of attributes object.
     */
    async _loadChildAttributes(sourceChild, attributeStorageInfo) {
        const promises = [];
        const { attributeUrls } = sourceChild.header;
        for (let index = 0; index < attributeUrls.length; index++) {
            const inputUrl = attributeUrls[index];
            const attribute = attributeStorageInfo[index];
            const options = {
                attributeName: attribute.name,
                attributeType: this._getAttributeType(attribute)
            };
            promises.push((0, core_1.load)(inputUrl, i3s_1.I3SAttributeLoader, options));
        }
        const attributesList = await Promise.all(promises);
        this._replaceNestedArrays(attributesList);
        return Object.assign({}, ...attributesList);
    }
    /**
     * Returns attribute type for loading attributes
     * @param attribute
     * Workaround for I3S v1.6. There is no attribute.attributeValues.valueType field in attribute.
     * There is an 'Oid32' type if attribute has objectIds property.
     * Doc: https://github.com/Esri/i3s-spec/blob/master/docs/1.6/attributeStorageInfo.cmn.md
     */
    _getAttributeType(attribute) {
        if (attribute.attributeValues) {
            return attribute.attributeValues.valueType;
        }
        else if (attribute.objectIds) {
            return 'Oid32';
        }
        return '';
    }
    /**
     * Make simple arrays from attribute typed arrays.
     * @param attributesList
     */
    _replaceNestedArrays(attributesList) {
        for (let index = 0; index < attributesList.length; index++) {
            const attributeObject = attributesList[index];
            for (const key in attributeObject) {
                attributeObject[key] = Array.from(attributeObject[key]);
            }
        }
    }
    /**
     * Print statistics in the end of conversion
     * @param params - output files data
     */
    async _finishConversion(params) {
        const filesSize = await (0, statistic_utills_1.calculateFilesSize)(params);
        const diff = process_1.default.hrtime(this.conversionStartTime);
        const conversionTime = (0, statistic_utills_1.timeConverter)(diff);
        console.log(`------------------------------------------------`); // eslint-disable-line
        console.log(`Finish conversion of ${I3S}`); // eslint-disable-line
        console.log(`Total conversion time: ${conversionTime}`); // eslint-disable-line
        console.log(`Vertex count: `, this.vertexCounter); // eslint-disable-line
        console.log(`File(s) size: `, filesSize, ' bytes'); // eslint-disable-line
        console.log(`------------------------------------------------`); // eslint-disable-line
    }
    async loadWorkers() {
        console.log(`Loading workers source...`); // eslint-disable-line no-undef, no-console
        const tile3dAttributesWorkerUrl = (0, worker_utils_1.getWorkerURL)(_3d_tiles_attributes_worker_1.Tile3dAttributesWorker, { ...(0, core_1.getLoaderOptions)() });
        const sourceResponse = await (0, core_1.fetchFile)(tile3dAttributesWorkerUrl);
        const source = await sourceResponse.text();
        this.workerSource.tile3dWorkerSource = source;
        console.log(`Loading workers source completed!`); // eslint-disable-line no-undef, no-console
    }
}
exports.default = Tiles3DConverter;
