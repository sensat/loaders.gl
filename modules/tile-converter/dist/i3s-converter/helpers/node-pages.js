"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const json_map_transform_1 = __importDefault(require("json-map-transform"));
const metadata_1 = require("../json-templates/metadata");
const file_utils_1 = require("../../lib/utils/file-utils");
/**
 * class NodePages - wrapper of nodePages array
 *
 * @example
 * import {writeFile} from './helpers/write-file.js';
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
class NodePages {
    /**
     * @constructs
     * Create a nodePages instance.
     * @param writeFileFunc - function to save one nodePage into a file
     * @param nodesPerPage - length limit for one nodePage. An additional nodePage is created when this limit is met
     */
    constructor(writeFileFunc, nodesPerPage, converter) {
        this.length = 0;
        this.nodesPerPage = nodesPerPage;
        this.nodesCounter = 0;
        // @ts-expect-error
        this.nodePages = [{}];
        this.nodePages[0].nodes = [];
        this.writeFile = writeFileFunc;
        this.converter = converter;
        this.length = 0;
    }
    /**
     * Setup function to save node pages
     * @param func - function which should be used to save node pages
     */
    useWriteFunction(func) {
        this.writeFile = func;
    }
    /**
     * Get file path and file name of the node page with the particular id
     * @param nodePageId - node page id
     * @returns file path and file name
     */
    getNodePageFileName(nodePageId) {
        let filePath;
        let fileName;
        if (this.converter.options.slpk) {
            filePath = (0, path_1.join)(this.converter.layers0Path, 'nodepages');
            fileName = `${nodePageId.toString()}.json`;
        }
        else {
            filePath = (0, path_1.join)(this.converter.layers0Path, 'nodepages', nodePageId.toString());
            fileName = 'index.json';
        }
        return { filePath, fileName };
    }
    /**
     * Load node page from a file on the disk
     * @param nodePageId - node page id
     * @returns - node page data
     */
    async loadNodePage(nodePageId) {
        const { filePath, fileName } = this.getNodePageFileName(nodePageId);
        const fullName = (0, path_1.join)(filePath, fileName);
        if (await (0, file_utils_1.isFileExists)(fullName)) {
            console.log(`load ${fullName}.`); // eslint-disable-line
            return (await (0, file_utils_1.openJson)(filePath, fileName));
        }
        else {
            return { nodes: [] };
        }
    }
    /**
     * Get nodepage id by node id
     * @param id node id
     * @returns node page id
     */
    getPageIndexByNodeId(id) {
        return Math.floor(id / this.nodesPerPage);
    }
    /**
     * Get node page data by node id
     * @param id node id
     * @returns node page data
     */
    async getPageByNodeId(id) {
        const pageIndex = this.getPageIndexByNodeId(id);
        if (this.converter.options.instantNodeWriting) {
            return await this.loadNodePage(pageIndex);
        }
        return this.nodePages[pageIndex];
    }
    /**
     * Get the node by its end-to-end index
     * @param id - end-to-end index of the node
     * @return the node object
     */
    async getNodeById(id, nodePage) {
        const nodeIndex = id % this.nodesPerPage;
        nodePage = nodePage || (await this.getPageByNodeId(id));
        return nodePage.nodes[nodeIndex];
    }
    /**
     * Add a child id into the parent node.children array
     * @param parentId - end-to-end parent node index
     * @param childId - end-to-end child node index
     */
    async addChildRelation(parentId, childId) {
        if (parentId === null || parentId === undefined) {
            return;
        }
        const parentNode = await this.getNodeById(parentId);
        parentNode.children?.push(childId);
        await this.saveNode(parentNode);
    }
    /**
     * Put new node in nodePages array
     * @param node - node object
     * @param parentId - index of parent node
     * @return
     */
    async push(node, parentId) {
        node.index = this.nodesCounter++;
        if (!this.converter.options.instantNodeWriting) {
            let currentNodePage = this.nodePages[this.nodePages.length - 1];
            if (currentNodePage.nodes.length === this.nodesPerPage) {
                currentNodePage = { nodes: [] };
                this.nodePages.push(currentNodePage);
            }
            currentNodePage.nodes.push(node);
        }
        await this.addChildRelation(parentId, node.index);
        NodePages.updateResourceInMesh(node);
        await this.saveNode(node);
        return node;
    }
    /**
     * Save node to the file on the disk
     * @param node - node data
     */
    async saveNode(node) {
        if (!this.converter.options.instantNodeWriting) {
            return;
        }
        else {
            const nodePageIndex = this.getPageIndexByNodeId(node.index);
            const nodePage = await this.getPageByNodeId(node.index);
            const { filePath, fileName } = this.getNodePageFileName(nodePageIndex);
            const nodeToUpdate = await this.getNodeById(node.index, nodePage);
            if (nodeToUpdate) {
                NodePages.updateAll(nodeToUpdate, node);
            }
            else {
                nodePage.nodes.push(node);
            }
            const nodePageStr = JSON.stringify(nodePage);
            if (this.converter.options.slpk) {
                await this.converter.writeQueue.enqueue({
                    archiveKey: `nodePages/${nodePageIndex.toString()}.json.gz`,
                    writePromise: () => this.writeFile(filePath, nodePageStr, fileName, true, this.converter.compressList)
                }, true);
            }
            else {
                await this.converter.writeQueue.enqueue({
                    writePromise: () => this.writeFile(filePath, nodePageStr)
                }, true);
            }
        }
    }
    /**
     * Save metadata file (for slpk only)
     */
    async saveMetadata() {
        const metadata = (0, json_map_transform_1.default)({ nodeCount: this.nodesCounter }, (0, metadata_1.METADATA)());
        const compress = false;
        await this.converter.writeQueue.enqueue({
            archiveKey: 'metadata.json',
            writePromise: () => this.writeFile(this.converter.layers0Path, JSON.stringify(metadata), 'metadata.json', compress)
        });
    }
    /**
     * Save all the node pages
     * Run this method when all nodes is pushed in nodePages
     */
    async save() {
        if (this.converter.options.instantNodeWriting) {
            await this.saveMetadata();
            return;
        }
        if (this.converter.options.slpk) {
            for (const [index, nodePage] of this.nodePages.entries()) {
                const nodePageStr = JSON.stringify(nodePage);
                const slpkPath = (0, path_1.join)(this.converter.layers0Path, 'nodepages');
                await this.converter.writeQueue.enqueue({
                    archiveKey: `nodePages/${index.toString()}.json.gz`,
                    writePromise: () => this.writeFile(slpkPath, nodePageStr, `${index.toString()}.json`)
                });
            }
            await this.saveMetadata();
        }
        else {
            for (const [index, nodePage] of this.nodePages.entries()) {
                const nodePageStr = JSON.stringify(nodePage);
                const nodePagePath = (0, path_1.join)(this.converter.layers0Path, 'nodepages', index.toString());
                await this.converter.writeQueue.enqueue({
                    writePromise: () => this.writeFile(nodePagePath, nodePageStr)
                });
            }
        }
    }
    /**
     * Update resource index in node.mesh object
     * @param node - node object
     */
    static updateResourceInMesh(node) {
        if (node.mesh && isFinite(node.index)) {
            node.mesh.geometry.resource = node.index;
        }
    }
    /**
     * Update all fields in the node excluding id
     * @param node - node object
     * @param data - NodeInPage data to replace original data
     */
    static updateAll(node, data) {
        Object.assign(node, data, { index: node.index });
        NodePages.updateResourceInMesh(node);
        return node;
    }
    /**
     * Update material in node.mesh object by node id
     * @param id - end-to-end index of the node
     * @param materialId - id from scene layer materialDefinitions
     */
    static updateMaterialByNodeId(node, materialId) {
        if (!node.mesh) {
            return;
        }
        node.mesh.material = {
            definition: materialId,
            resource: node.index
        };
    }
    /**
     * Update vertexCount in node.mesh.geometry object by node id
     * @param id - end-to-end index of the node
     * @param vertexCount - vertex count for particular node
     */
    static updateVertexCountByNodeId(node, vertexCount) {
        if (!node.mesh) {
            return;
        }
        node.mesh.geometry.vertexCount = vertexCount;
    }
    /**
     * Update resource in node.mesh.attribute object by node id
     * @param node - node object
     */
    static updateNodeAttributeByNodeId(node) {
        if (!node.mesh || !node.index) {
            return;
        }
        node.mesh.attribute.resource = node.index;
    }
    /**
     * Update featureCount in node.mesh.geometry object by node id
     * @param node - node object
     * @param featureCount - features count of the node
     */
    static updateFeatureCountByNodeId(node, featureCount) {
        if (!node.mesh) {
            return;
        }
        node.mesh.geometry.featureCount = featureCount;
    }
    /**
     * Update texelCountHint in node.mesh.material object by node id
     * @param node - node object
     * @param texelCountHint - texelCountHint of particular node
     */
    static updateTexelCountHintByNodeId(node, texelCountHint) {
        if (!node.mesh || !node.mesh.material) {
            return;
        }
        node.mesh.material.texelCountHint = texelCountHint;
    }
}
exports.default = NodePages;
