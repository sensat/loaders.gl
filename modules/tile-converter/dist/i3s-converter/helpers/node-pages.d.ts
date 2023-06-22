import { NodeInPage } from '@loaders.gl/i3s';
import I3SConverter from '../i3s-converter';
/**
 * class NodePages - wrapper of nodePages array
 *
 * @example
 * import {writeFile} from './helpers/write-file';
 *
 * // create an instance of the class
 * const nodePages = new NodePages(writeFile, HARDCODED_NODES_PER_PAGE);
 * ...
 * // push root node
 * const parent = await nodePages.push({
      lodThreshold: HARDCODED_MAX_SCREEN_THRESHOLD_SQ,
      obb: coordinates.obb,
      children: []
    });
 * ...
 * // push node with parent relation
 * const nodeInPage = {
      lodThreshold: HARDCODED_MAX_SCREEN_THRESHOLD_SQ,
      obb: coordinates.obb,
      children: [],
      mesh: {
        geometry: {
          definition: 0
        }
      }
    };
 * const node = await this.nodePages.push(nodeInPage, parent.index);
 * ...
 * // save all the nodePages in the end of pushing all the nodes
 * await this.nodePages.save(layers0path);
 */
export default class NodePages {
    readonly nodesPerPage: number;
    nodesCounter: number;
    writeFile: (...args: any[]) => Promise<null | string>;
    converter: I3SConverter;
    readonly nodePages: {
        nodes: NodeInPage[];
    }[];
    readonly length: number;
    /**
     * @constructs
     * Create a nodePages instance.
     * @param writeFileFunc - function to save one nodePage into a file
     * @param nodesPerPage - length limit for one nodePage. An additional nodePage is created when this limit is met
     */
    constructor(writeFileFunc: any, nodesPerPage: any, converter: I3SConverter);
    /**
     * Setup function to save node pages
     * @param func - function which should be used to save node pages
     */
    useWriteFunction(func: (...args: any[]) => Promise<null | string>): void;
    /**
     * Get file path and file name of the node page with the particular id
     * @param nodePageId - node page id
     * @returns file path and file name
     */
    private getNodePageFileName;
    /**
     * Load node page from a file on the disk
     * @param nodePageId - node page id
     * @returns - node page data
     */
    private loadNodePage;
    /**
     * Get nodepage id by node id
     * @param id node id
     * @returns node page id
     */
    private getPageIndexByNodeId;
    /**
     * Get node page data by node id
     * @param id node id
     * @returns node page data
     */
    private getPageByNodeId;
    /**
     * Get the node by its end-to-end index
     * @param id - end-to-end index of the node
     * @return the node object
     */
    getNodeById(id: number, nodePage?: {
        nodes: NodeInPage[];
    }): Promise<NodeInPage>;
    /**
     * Add a child id into the parent node.children array
     * @param parentId - end-to-end parent node index
     * @param childId - end-to-end child node index
     */
    private addChildRelation;
    /**
     * Put new node in nodePages array
     * @param node - node object
     * @param parentId - index of parent node
     * @return
     */
    push(node: NodeInPage, parentId?: number): Promise<NodeInPage>;
    /**
     * Save node to the file on the disk
     * @param node - node data
     */
    saveNode(node: NodeInPage): Promise<void>;
    /**
     * Save metadata file (for slpk only)
     */
    saveMetadata(): Promise<void>;
    /**
     * Save all the node pages
     * Run this method when all nodes is pushed in nodePages
     */
    save(): Promise<void>;
    /**
     * Update resource index in node.mesh object
     * @param node - node object
     */
    static updateResourceInMesh(node: NodeInPage): void;
    /**
     * Update all fields in the node excluding id
     * @param node - node object
     * @param data - NodeInPage data to replace original data
     */
    static updateAll(node: NodeInPage, data: NodeInPage): NodeInPage;
    /**
     * Update material in node.mesh object by node id
     * @param id - end-to-end index of the node
     * @param materialId - id from scene layer materialDefinitions
     */
    static updateMaterialByNodeId(node: NodeInPage, materialId: number): void;
    /**
     * Update vertexCount in node.mesh.geometry object by node id
     * @param id - end-to-end index of the node
     * @param vertexCount - vertex count for particular node
     */
    static updateVertexCountByNodeId(node: NodeInPage, vertexCount: number): void;
    /**
     * Update resource in node.mesh.attribute object by node id
     * @param node - node object
     */
    static updateNodeAttributeByNodeId(node: NodeInPage): void;
    /**
     * Update featureCount in node.mesh.geometry object by node id
     * @param node - node object
     * @param featureCount - features count of the node
     */
    static updateFeatureCountByNodeId(node: NodeInPage, featureCount: number): void;
    /**
     * Update texelCountHint in node.mesh.material object by node id
     * @param node - node object
     * @param texelCountHint - texelCountHint of particular node
     */
    static updateTexelCountHintByNodeId(node: NodeInPage, texelCountHint: number): void;
}
//# sourceMappingURL=node-pages.d.ts.map