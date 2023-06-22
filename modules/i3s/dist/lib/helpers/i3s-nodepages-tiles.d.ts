import type { LoaderOptions } from '@loaders.gl/loader-utils';
import { I3STilesetHeader, NodePage, NodeInPage, I3STextureFormat, I3STileHeader } from '../../types';
/**
 * class I3SNodePagesTiles - loads nodePages and form i3s tiles from them
 */
export default class I3SNodePagesTiles {
    tileset: I3STilesetHeader;
    nodePages: NodePage[];
    pendingNodePages: {
        promise: Promise<NodePage>;
        status: 'Pending' | 'Done';
    }[];
    nodesPerPage: number;
    options: LoaderOptions;
    lodSelectionMetricType?: string;
    textureDefinitionsSelectedFormats: ({
        format: I3STextureFormat;
        name: string;
    } | null)[];
    nodesInNodePages: number;
    private textureLoaderOptions;
    /**
     * @constructs
     * Create a I3SNodePagesTiles instance.
     * @param tileset - i3s tileset header ('layers/0')
     * @param options - i3s loader options
     */
    constructor(tileset: I3STilesetHeader, options: LoaderOptions);
    /**
     * Loads some nodePage and return a particular node from it
     * @param id - id of node through all node pages
     */
    getNodeById(id: number): Promise<NodeInPage>;
    /**
     * Forms tile header using node and tileset data
     * @param id - id of node through all node pages
     */
    formTileFromNodePages(id: number): Promise<I3STileHeader>;
    /**
     * Forms url and type of geometry resource by nodepage's data and `geometryDefinitions` in the tileset
     * @param - data about the node's mesh from the nodepage
     * @returns -
     *   {string} url - url to the geometry resource
     *   {boolean} isDracoGeometry - whether the geometry resource contain DRACO compressed geometry
     */
    private getContentUrl;
    /**
     * Forms 1.6 compatible LOD selection object from a nodepage's node data
     * @param node - a node from nodepage
     * @returns- Array of LodSelection
     */
    private getLodSelection;
    /**
     * Returns information about texture and material from `materialDefinitions`
     * @param material - material data from nodepage
     * @returns - Couple {textureData, materialDefinition}
     * {string} textureData.name - path name of the texture
     * {string} textureData.format - format of the texture
     * materialDefinition - PBR-like material definition from `materialDefinitions`
     */
    private getInformationFromMaterial;
    /**
     * Sets preferable and supported format for each textureDefinition of the tileset
     * @param tileset - I3S layer data
     * @returns
     */
    private initSelectedFormatsForTextureDefinitions;
    /**
     * Returns the array of supported texture format
     * @returns list of format strings
     */
    private getSupportedTextureFormats;
}
//# sourceMappingURL=i3s-nodepages-tiles.d.ts.map