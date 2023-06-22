import type { AttributeStorageInfo } from '@loaders.gl/i3s';
import { Tileset3D } from '@loaders.gl/tiles';
import { Geoid } from '@math.gl/geoid';
/**
 * Converter from i3s to 3d-tiles
 */
export default class Tiles3DConverter {
    options: any;
    tilesetPath: string;
    vertexCounter: number;
    conversionStartTime: [number, number];
    geoidHeightModel: Geoid | null;
    sourceTileset: Tileset3D | null;
    attributeStorageInfo: AttributeStorageInfo | null;
    workerSource: {
        [key: string]: string;
    };
    constructor();
    /**
     * Convert i3s format data to 3dTiles
     * @param options
     * @param options.inputUrl the url to read the tileset from
     * @param options.outputPath the output filename
     * @param options.tilesetName the output name of the tileset
     * @param options.egmFilePath location of *.pgm file to convert heights from ellipsoidal to gravity-related format
     * @param options.maxDepth The max tree depth of conversion
     */
    convert(options: {
        inputUrl: string;
        outputPath: string;
        tilesetName: string;
        maxDepth?: number;
        egmFilePath: string;
    }): Promise<any>;
    /**
     * Convert particular I3S Node
     * @param parentSourceNode the parent node tile object (@loaders.gl/tiles/Tile3D)
     * @param parentNode object in resulting tileset
     * @param level a current level of a tree depth
     * @param childNodeInfo child node to convert
     */
    private convertChildNode;
    /**
     * The recursive function of traversal of a nodes tree
     * @param parentSourceNode the parent node tile object (@loaders.gl/tiles/Tile3D)
     * @param parentNode object in resulting tileset
     * @param level a current level of a tree depth
     */
    private _addChildren;
    /**
     * Load a child node having information from the node header
     * @param parentNode a parent node tile object (@loaders.gl/tiles/Tile3D)
     * @param childNodeInfo child information from 3DNodeIndexDocument
     *   (https://github.com/Esri/i3s-spec/blob/master/docs/1.7/nodeReference.cmn.md)
     */
    private _loadChildNode;
    /**
     * Make an url of a resource from its relative url having the base url
     * @param baseUrl the base url. A resulting url will be related from this url
     * @param relativeUrl a realtive url of a resource
     */
    private _relativeUrlToFullUrl;
    /**
     * Do loading all attributes related to particular node.
     * @param sourceChild
     * @param attributeStorageInfo
     * @returns Promise of attributes object.
     */
    private _loadChildAttributes;
    /**
     * Returns attribute type for loading attributes
     * @param attribute
     * Workaround for I3S v1.6. There is no attribute.attributeValues.valueType field in attribute.
     * There is an 'Oid32' type if attribute has objectIds property.
     * Doc: https://github.com/Esri/i3s-spec/blob/master/docs/1.6/attributeStorageInfo.cmn.md
     */
    private _getAttributeType;
    /**
     * Make simple arrays from attribute typed arrays.
     * @param attributesList
     */
    private _replaceNestedArrays;
    /**
     * Print statistics in the end of conversion
     * @param params - output files data
     */
    private _finishConversion;
    private loadWorkers;
}
//# sourceMappingURL=3d-tiles-converter.d.ts.map