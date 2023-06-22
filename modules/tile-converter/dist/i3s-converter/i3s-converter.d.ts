import type { WriteQueueItem } from '../lib/utils/write-queue';
import type { SceneLayer3D } from '@loaders.gl/i3s';
import { Tileset3D } from '@loaders.gl/tiles';
import { Geoid } from '@math.gl/geoid';
import NodePages from './helpers/node-pages';
import { LoaderWithParser } from '@loaders.gl/loader-utils';
import { I3SMaterialDefinition } from '@loaders.gl/i3s/src/types';
import WriteQueue from '../lib/utils/write-queue';
/**
 * Converter from 3d-tiles tileset to i3s layer
 */
export default class I3SConverter {
    nodePages: NodePages;
    options: any;
    layers0Path: string;
    materialMap: Map<string, number>;
    materialDefinitions: I3SMaterialDefinition[];
    geometryMap: Map<string, number>;
    geometryConfigs: {
        hasTexture: boolean;
        hasUvRegions: boolean;
    }[];
    vertexCounter: number;
    layers0: SceneLayer3D | null;
    featuresHashArray: string[];
    refinementCounter: {
        tilesCount: number;
        tilesWithAddRefineCount: number;
    };
    validate: boolean;
    boundingVolumeWarnings?: string[];
    conversionStartTime: [number, number];
    refreshTokenTime: [number, number];
    sourceTileset: Tileset3D | null;
    geoidHeightModel: Geoid | null;
    Loader: LoaderWithParser;
    generateTextures: boolean;
    generateBoundingVolumes: boolean;
    layersHasTexture: boolean;
    workerSource: {
        [key: string]: string;
    };
    writeQueue: WriteQueue<WriteQueueItem>;
    compressList: string[] | null;
    constructor();
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
    convert(options: {
        inputUrl: string;
        outputPath: string;
        tilesetName: string;
        sevenZipExe: string;
        egmFilePath: string;
        maxDepth?: number;
        slpk?: boolean;
        token?: string;
        draco?: boolean;
        mergeMaterials?: boolean;
        validate?: boolean;
        generateTextures?: boolean;
        generateBoundingVolumes?: boolean;
        instantNodeWriting?: boolean;
    }): Promise<any>;
    /**
     * Convert and save the layer and embedded tiles
     * @param outputPath - path to save output data
     * @param tilesetName - new tileset path
     */
    private _createAndSaveTileset;
    /**
     * Form object of 3DSceneLayer https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DSceneLayer.cmn.md
     * @param  tilesetName - Name of layer
     */
    private _formLayers0;
    /**
     * Form object of 3DSceneLayer https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DSceneLayer.cmn.md
     * @param rootNode - 3DNodeIndexDocument of root node https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md
     * @param sourceRootTile - Source (3DTile) tile data
     */
    private _convertNodesTree;
    /**
     * Write 3DSceneLayer https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DSceneLayer.cmn.md in file
     */
    private _writeLayers0;
    /**
     * Pack files into *.slpk archive
     * @param tilesetPath - Path to save file
     */
    private _createSlpk;
    /**
     * Add child nodes recursively and write them to files
     * @param data - arguments
     * @param data.parentNode - 3DNodeIndexDocument of parent node
     * @param data.sourceTiles - array of source child nodes
     * @param data.level - level of node (distanse to root node in the tree)
     */
    private _addChildrenWithNeighborsAndWriteFile;
    /**
     * Convert nested subtree of 3DTiles dataset
     * @param param0
     * @param data.parentNode - 3DNodeIndexDocument of parent node
     * @param param0.sourceTile - source 3DTile data
     * @param param0.level - tree level
     */
    private convertNestedTileset;
    /**
     * Convert 3DTiles tile to I3S node
     * @param param0
     * @param param0.parentNode - 3DNodeIndexDocument of parent node
     * @param param0.sourceTile - source 3DTile data
     * @param param0.level - tree level
     */
    private convertNode;
    /**
     * Add child nodes recursively and write them to files
     * @param param0 - arguments
     * @param param0.parentNode - 3DNodeIndexDocument of parent node
     * @param param0.sourceTile - source 3DTile data
     * @param param0.level - tree level
     */
    private _addChildren;
    /**
     * Convert tile to one or more I3S nodes
     * @param parentNode - 3DNodeIndexDocument of parent node
     * @param sourceTile - source 3DTile data
     * @param level - tree level
     */
    private _createNode;
    /**
     * Convert tile to one or more I3S nodes
     * @param sourceTile - source tile (3DTile)
     * @param parentId - id of parent node in node pages
     * @param propertyTable - batch table from b3dm / feature properties from EXT_FEATURE_METADATA
     * @returns - converted node resources
     */
    private _convertResources;
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
    private _updateNodeInNodePages;
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
    private _writeResources;
    /**
     * Write non-compressed and compressed geometries in files
     * @param geometryBuffer - Uint8Array with geometry attributes
     * @param compressedGeometry - Uint8Array with compressed (draco) geometry
     * @param childPath - a child path to write resources
     * @param slpkChildPath - resource path inside *slpk file
     */
    private _writeGeometries;
    /**
     * Write shared resources in a file
     * @param sharedResources - shared resource data object
     * @param childPath - a child path to write resources
     * @param slpkChildPath - resource path inside *slpk file
     * @param nodePath - a node path
     */
    private _writeShared;
    /**
     * Generates textures based on texture mime type and fill in textureSetDefinitions data.
     * @param texture - the texture image
     * @param childPath - a child path to write resources
     * @param slpkChildPath - the resource path inside *slpk file
     */
    private _writeTexture;
    /**
     * Write the texture image in a file
     * @param textureData
     * @param name
     * @param format
     * @param childPath
     * @param slpkChildPath
     */
    private writeTextureFile;
    /**
     * Write feature attributes in files
     * @param attributes - feature attributes
     * @param childPath - a child path to write resources
     * @param slpkChildPath - the resource path inside *slpk file
     */
    private _writeAttributes;
    /**
     * Return file format by its MIME type
     * @param mimeType - feature attributes
     */
    private _getFormatByMimeType;
    /**
     * Find or create material in materialDefinitions array
     * @param material - end-to-end index of the node
     * @return material id
     */
    private _findOrCreateMaterial;
    /**
     * Get unique geometry configuration index
     * In the end of conversion configurations will be transformed to geometryDefinitions array
     * @param hasTexture
     * @param hasUvRegions
     * @returns
     */
    private findOrCreateGeometryDefinition;
    /**
     * Do conversion of 3DTiles property table to I3s node attributes.
     * @param propertyTable - Table with layer meta data.
     */
    private _convertPropertyTableToNodeAttributes;
    /**
     * Print statistics in the end of conversion
     * @param params - output files data
     */
    private _finishConversion;
    /**
     * Fetch preload options for ION tileset
     */
    private _fetchPreloadOptions;
    /**
     * Update options of source tileset
     */
    private _updateTilesetOptions;
    /** Do calculations of all tiles and tiles with "ADD" type of refinement.
     * @param tile
     */
    private _checkAddRefinementTypeForTile;
    /**
     * Check if the tile's content format is supported by the converter
     * @param sourceRootTile
     * @returns
     */
    private isContentSupported;
    private loadWorkers;
}
//# sourceMappingURL=i3s-converter.d.ts.map