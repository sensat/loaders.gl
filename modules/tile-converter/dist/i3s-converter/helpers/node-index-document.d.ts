import { BoundingVolumes, LodSelection, Node3DIndexDocument, NodeInPage } from '@loaders.gl/i3s';
import I3SConverter from '../i3s-converter';
import { I3SConvertedResources } from '../types';
/**
 * Wrapper for https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md data
 * The class allows working with 3DNodeIndexDocument in 2 modes:
 * in memory: the data is stored in `data` field
 * on disk: the data is written on disk in a file. The file can be rewritten when new childrend or neighbors have to be added
 */
export declare class NodeIndexDocument {
    /** Node id */
    id: string;
    /** Id in node pages */
    inPageId: number;
    /** 3DNodeIndexDocument data */
    data: Node3DIndexDocument | null;
    /** children */
    children: NodeIndexDocument[];
    /** converter instance */
    private converter;
    /**
     * Constructor
     * @param id - id of the node in node pages
     * @param converter - converter instance
     */
    constructor(id: number, converter: I3SConverter);
    /**
     * Add Node3DIndexDocument data to the node
     * @param data Node3DIndexDocument data
     * @returns this NodeIndexDocument instance (to recurring with constructor)
     */
    addData(data: Node3DIndexDocument): Promise<NodeIndexDocument>;
    /**
     * Add child node references
     * @param childNodes - child NodeIndexDocument instances
     */
    addChildren(childNodes: NodeIndexDocument[]): Promise<void>;
    /**
     * Add neighbors to child nodes of this node
     */
    addNeighbors(): Promise<void>;
    /** Save 3DNodeIndexDocument in file on disk */
    save(): Promise<void>;
    /**
     * Write 3DNodeIndexDocument https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md
     * @param node - Node3DIndexDocument object
     */
    private write;
    /**
     * Load 3DNodeIndexDocument data from file on disk
     * @returns 3DNodeIndexDocument object
     */
    private load;
    /**
     * Unload the Node data
     */
    private flush;
    /**
     * Create root node of the tree
     * @param boundingVolumes - MBS and OOB bounding volumes data
     * @param converter - I3SConverter instance
     * @returns instance of NodeIndexDocument
     */
    static createRootNode(boundingVolumes: BoundingVolumes, converter: I3SConverter): Promise<NodeIndexDocument>;
    /**
     * Create NodeIndexDocument instance
     * @param parentNode - parent NodeIndexDocument
     * @param boundingVolumes - MBS and OOB bounding volumes data
     * @param lodSelection - LOD metrics data
     * @param nodeInPage - node data in node pages
     * @param resources - resources extracted from gltf/b3dm file
     * @param converter - I3SConverter instance
     * @returns NodeIndexDocument instance
     */
    static createNode(parentNode: NodeIndexDocument, boundingVolumes: BoundingVolumes, lodSelection: LodSelection[], nodeInPage: NodeInPage, resources: I3SConvertedResources, converter: I3SConverter): Promise<NodeIndexDocument>;
    /**
     * Form 3DNodeIndexDocument data for the root node
     * @param boundingVolumes - mbs and obb data about node's bounding volume
     * @return 3DNodeIndexDocument data https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md
     */
    static createRootNodeIndexDocument(boundingVolumes: BoundingVolumes): Node3DIndexDocument;
    /**
     * Create a new Node3DIndexDocument
     * @param parentNode - 3DNodeIndexDocument https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md object of the parent node
     * @param boundingVolumes - Bounding volumes
     * @param lodSelection - Level of Details (LOD) metrics
     * @param nodeInPage - corresponding node object in a node page
     * @param resources - the node resources data
     * @param resources.texture - texture image
     * @param resources.attributes - feature attributes
     * @return 3DNodeIndexDocument https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md object
     */
    static createNodeIndexDocument(parentNode: NodeIndexDocument, boundingVolumes: BoundingVolumes, lodSelection: LodSelection[], nodeInPage: NodeInPage, resources: I3SConvertedResources): Promise<Node3DIndexDocument>;
}
//# sourceMappingURL=node-index-document.d.ts.map