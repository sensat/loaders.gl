"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeIndexDocument = void 0;
const path_1 = require("path");
const json_map_transform_1 = __importDefault(require("json-map-transform"));
const uuid_1 = require("uuid");
const file_utils_1 = require("../../lib/utils/file-utils");
const node_1 = require("../json-templates/node");
/**
 * Wrapper for https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md data
 * The class allows working with 3DNodeIndexDocument in 2 modes:
 * in memory: the data is stored in `data` field
 * on disk: the data is written on disk in a file. The file can be rewritten when new childrend or neighbors have to be added
 */
class NodeIndexDocument {
    /**
     * Constructor
     * @param id - id of the node in node pages
     * @param converter - converter instance
     */
    constructor(id, converter) {
        /** 3DNodeIndexDocument data */
        this.data = null;
        /** children */
        this.children = [];
        this.inPageId = id;
        this.id = id === 0 ? 'root' : id.toString();
        this.converter = converter;
    }
    /**
     * Add Node3DIndexDocument data to the node
     * @param data Node3DIndexDocument data
     * @returns this NodeIndexDocument instance (to recurring with constructor)
     */
    async addData(data) {
        if (this.converter.options.instantNodeWriting) {
            await this.write(data);
        }
        else {
            this.data = data;
        }
        return this;
    }
    /**
     * Add child node references
     * @param childNodes - child NodeIndexDocument instances
     */
    async addChildren(childNodes) {
        const newChildren = [];
        for (const node of childNodes) {
            const nodeData = await node.load();
            newChildren.push({
                id: node.id,
                href: `../${node.id}`,
                obb: nodeData.obb,
                mbs: nodeData.mbs
            });
        }
        this.children = this.children.concat(childNodes);
        let data = this.data;
        if (this.converter.options.instantNodeWriting) {
            data = (await this.load());
        }
        if (data) {
            data.children = data.children ?? [];
            data.children = data.children.concat(newChildren);
        }
        if (this.converter.options.instantNodeWriting && data) {
            await this.write(data);
        }
    }
    /**
     * Add neighbors to child nodes of this node
     */
    async addNeighbors() {
        const nodeData = await this.load();
        for (const childNode of this.children) {
            const childNodeData = await childNode.load();
            childNodeData.neighbors = childNodeData.neighbors ?? [];
            // Don't do large amount of "neightbors" to avoid big memory consumption
            if (Number(nodeData?.children?.length) < 1000) {
                for (const neighbor of nodeData.children || []) {
                    if (childNode.id === neighbor.id) {
                        continue; // eslint-disable-line
                    }
                    childNodeData.neighbors.push({ ...neighbor });
                }
            }
            else {
                // eslint-disable-next-line no-console, no-undef
                console.warn(`Node ${childNode.id}: neighbors attribute is omited because of large number of neigbors`);
                delete childNodeData.neighbors;
            }
            if (this.converter.options.instantNodeWriting && childNodeData) {
                await childNode.write(childNodeData);
            }
            await childNode.save();
            // The save after adding neighbors is the last one. Flush the the node
            childNode.flush();
        }
    }
    /** Save 3DNodeIndexDocument in file on disk */
    async save() {
        if (this.data) {
            await this.write(this.data);
        }
    }
    /**
     * Write 3DNodeIndexDocument https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md
     * @param node - Node3DIndexDocument object
     */
    async write(node) {
        const path = (0, path_1.join)(this.converter.layers0Path, 'nodes', this.id);
        if (this.converter.options.slpk) {
            await this.converter.writeQueue.enqueue({
                archiveKey: `nodes/${this.id}/3dNodeIndexDocument.json.gz`,
                writePromise: () => (0, file_utils_1.writeFileForSlpk)(path, JSON.stringify(node), '3dNodeIndexDocument.json', true, this.converter.compressList)
            }, true);
        }
        else {
            await this.converter.writeQueue.enqueue({ writePromise: () => (0, file_utils_1.writeFile)(path, JSON.stringify(node)) }, true);
        }
    }
    /**
     * Load 3DNodeIndexDocument data from file on disk
     * @returns 3DNodeIndexDocument object
     */
    async load() {
        if (this.data) {
            return this.data;
        }
        const path = this.id;
        const parentNodePath = (0, path_1.join)(this.converter.layers0Path, 'nodes', path);
        let parentNodeFileName = 'index.json';
        if (this.converter.options.slpk) {
            parentNodeFileName = '3dNodeIndexDocument.json';
        }
        return (await (0, file_utils_1.openJson)(parentNodePath, parentNodeFileName));
    }
    /**
     * Unload the Node data
     */
    flush() {
        this.data = null;
    }
    /**
     * Create root node of the tree
     * @param boundingVolumes - MBS and OOB bounding volumes data
     * @param converter - I3SConverter instance
     * @returns instance of NodeIndexDocument
     */
    static async createRootNode(boundingVolumes, converter) {
        const rootData = NodeIndexDocument.createRootNodeIndexDocument(boundingVolumes);
        const rootNode = await new NodeIndexDocument(0, converter).addData(rootData);
        return rootNode;
    }
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
    static async createNode(parentNode, boundingVolumes, lodSelection, nodeInPage, resources, converter) {
        const data = await NodeIndexDocument.createNodeIndexDocument(parentNode, boundingVolumes, lodSelection, nodeInPage, resources);
        const node = await new NodeIndexDocument(nodeInPage.index, converter).addData(data);
        return node;
    }
    /**
     * Form 3DNodeIndexDocument data for the root node
     * @param boundingVolumes - mbs and obb data about node's bounding volume
     * @return 3DNodeIndexDocument data https://github.com/Esri/i3s-spec/blob/master/docs/1.7/3DNodeIndexDocument.cmn.md
     */
    static createRootNodeIndexDocument(boundingVolumes) {
        const root0data = {
            version: `{${(0, uuid_1.v4)().toUpperCase()}}`,
            id: 'root',
            level: 0,
            lodSelection: [
                {
                    metricType: 'maxScreenThresholdSQ',
                    maxError: 0
                },
                {
                    metricType: 'maxScreenThreshold',
                    maxError: 0
                }
            ],
            ...boundingVolumes,
            children: []
        };
        return (0, json_map_transform_1.default)(root0data, (0, node_1.NODE)());
    }
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
    static async createNodeIndexDocument(parentNode, boundingVolumes, lodSelection, nodeInPage, resources) {
        const { texture, attributes } = resources;
        const nodeId = nodeInPage.index;
        const parentNodeData = await parentNode.load();
        const nodeData = {
            version: parentNodeData.version,
            id: nodeId.toString(),
            level: parentNodeData.level + 1,
            ...boundingVolumes,
            lodSelection,
            parentNode: {
                id: parentNode.id,
                href: `../${parentNode.id}`,
                mbs: parentNodeData.mbs,
                obb: parentNodeData.obb
            },
            children: [],
            neighbors: []
        };
        const node = (0, json_map_transform_1.default)(nodeData, (0, node_1.NODE)());
        if (nodeInPage.mesh) {
            node.geometryData = [{ href: './geometries/0' }];
            node.sharedResource = { href: './shared' };
            if (texture) {
                node.textureData = [{ href: './textures/0' }, { href: './textures/1' }];
            }
            if (attributes &&
                attributes.length &&
                parentNode.converter.layers0?.attributeStorageInfo?.length) {
                node.attributeData = [];
                for (let index = 0; index < attributes.length; index++) {
                    const folderName = parentNode.converter.layers0.attributeStorageInfo[index].key;
                    node.attributeData.push({ href: `./attributes/${folderName}/0` });
                }
            }
        }
        return node;
    }
}
exports.NodeIndexDocument = NodeIndexDocument;
