import _defineProperty from "@babel/runtime/helpers/esm/defineProperty";
import { join } from 'path';
import transform from 'json-map-transform';
import { METADATA as metadataTemplate } from '../json-templates/metadata';
import { isFileExists, openJson } from '../../lib/utils/file-utils';
export default class NodePages {
  constructor(writeFileFunc, nodesPerPage, converter) {
    _defineProperty(this, "nodesPerPage", void 0);
    _defineProperty(this, "nodesCounter", void 0);
    _defineProperty(this, "writeFile", void 0);
    _defineProperty(this, "converter", void 0);
    _defineProperty(this, "nodePages", void 0);
    _defineProperty(this, "length", 0);
    this.nodesPerPage = nodesPerPage;
    this.nodesCounter = 0;
    this.nodePages = [{}];
    this.nodePages[0].nodes = [];
    this.writeFile = writeFileFunc;
    this.converter = converter;
    this.length = 0;
  }
  useWriteFunction(func) {
    this.writeFile = func;
  }
  getNodePageFileName(nodePageId) {
    let filePath;
    let fileName;
    if (this.converter.options.slpk) {
      filePath = join(this.converter.layers0Path, 'nodepages');
      fileName = "".concat(nodePageId.toString(), ".json");
    } else {
      filePath = join(this.converter.layers0Path, 'nodepages', nodePageId.toString());
      fileName = 'index.json';
    }
    return {
      filePath,
      fileName
    };
  }
  async loadNodePage(nodePageId) {
    const {
      filePath,
      fileName
    } = this.getNodePageFileName(nodePageId);
    const fullName = join(filePath, fileName);
    if (await isFileExists(fullName)) {
      console.log("load ".concat(fullName, "."));
      return await openJson(filePath, fileName);
    } else {
      return {
        nodes: []
      };
    }
  }
  getPageIndexByNodeId(id) {
    return Math.floor(id / this.nodesPerPage);
  }
  async getPageByNodeId(id) {
    const pageIndex = this.getPageIndexByNodeId(id);
    if (this.converter.options.instantNodeWriting) {
      return await this.loadNodePage(pageIndex);
    }
    return this.nodePages[pageIndex];
  }
  async getNodeById(id, nodePage) {
    const nodeIndex = id % this.nodesPerPage;
    nodePage = nodePage || (await this.getPageByNodeId(id));
    return nodePage.nodes[nodeIndex];
  }
  async addChildRelation(parentId, childId) {
    var _parentNode$children;
    if (parentId === null || parentId === undefined) {
      return;
    }
    const parentNode = await this.getNodeById(parentId);
    (_parentNode$children = parentNode.children) === null || _parentNode$children === void 0 ? void 0 : _parentNode$children.push(childId);
    await this.saveNode(parentNode);
  }
  async push(node, parentId) {
    node.index = this.nodesCounter++;
    if (!this.converter.options.instantNodeWriting) {
      let currentNodePage = this.nodePages[this.nodePages.length - 1];
      if (currentNodePage.nodes.length === this.nodesPerPage) {
        currentNodePage = {
          nodes: []
        };
        this.nodePages.push(currentNodePage);
      }
      currentNodePage.nodes.push(node);
    }
    await this.addChildRelation(parentId, node.index);
    NodePages.updateResourceInMesh(node);
    await this.saveNode(node);
    return node;
  }
  async saveNode(node) {
    if (!this.converter.options.instantNodeWriting) {
      return;
    } else {
      const nodePageIndex = this.getPageIndexByNodeId(node.index);
      const nodePage = await this.getPageByNodeId(node.index);
      const {
        filePath,
        fileName
      } = this.getNodePageFileName(nodePageIndex);
      const nodeToUpdate = await this.getNodeById(node.index, nodePage);
      if (nodeToUpdate) {
        NodePages.updateAll(nodeToUpdate, node);
      } else {
        nodePage.nodes.push(node);
      }
      const nodePageStr = JSON.stringify(nodePage);
      if (this.converter.options.slpk) {
        await this.converter.writeQueue.enqueue({
          archiveKey: "nodePages/".concat(nodePageIndex.toString(), ".json.gz"),
          writePromise: () => this.writeFile(filePath, nodePageStr, fileName, true, this.converter.compressList)
        }, true);
      } else {
        await this.converter.writeQueue.enqueue({
          writePromise: () => this.writeFile(filePath, nodePageStr)
        }, true);
      }
    }
  }
  async saveMetadata() {
    const metadata = transform({
      nodeCount: this.nodesCounter
    }, metadataTemplate());
    const compress = false;
    await this.converter.writeQueue.enqueue({
      archiveKey: 'metadata.json',
      writePromise: () => this.writeFile(this.converter.layers0Path, JSON.stringify(metadata), 'metadata.json', compress)
    });
  }
  async save() {
    if (this.converter.options.instantNodeWriting) {
      await this.saveMetadata();
      return;
    }
    if (this.converter.options.slpk) {
      for (const [index, nodePage] of this.nodePages.entries()) {
        const nodePageStr = JSON.stringify(nodePage);
        const slpkPath = join(this.converter.layers0Path, 'nodepages');
        await this.converter.writeQueue.enqueue({
          archiveKey: "nodePages/".concat(index.toString(), ".json.gz"),
          writePromise: () => this.writeFile(slpkPath, nodePageStr, "".concat(index.toString(), ".json"))
        });
      }
      await this.saveMetadata();
    } else {
      for (const [index, nodePage] of this.nodePages.entries()) {
        const nodePageStr = JSON.stringify(nodePage);
        const nodePagePath = join(this.converter.layers0Path, 'nodepages', index.toString());
        await this.converter.writeQueue.enqueue({
          writePromise: () => this.writeFile(nodePagePath, nodePageStr)
        });
      }
    }
  }
  static updateResourceInMesh(node) {
    if (node.mesh && isFinite(node.index)) {
      node.mesh.geometry.resource = node.index;
    }
  }
  static updateAll(node, data) {
    Object.assign(node, data, {
      index: node.index
    });
    NodePages.updateResourceInMesh(node);
    return node;
  }
  static updateMaterialByNodeId(node, materialId) {
    if (!node.mesh) {
      return;
    }
    node.mesh.material = {
      definition: materialId,
      resource: node.index
    };
  }
  static updateVertexCountByNodeId(node, vertexCount) {
    if (!node.mesh) {
      return;
    }
    node.mesh.geometry.vertexCount = vertexCount;
  }
  static updateNodeAttributeByNodeId(node) {
    if (!node.mesh || !node.index) {
      return;
    }
    node.mesh.attribute.resource = node.index;
  }
  static updateFeatureCountByNodeId(node, featureCount) {
    if (!node.mesh) {
      return;
    }
    node.mesh.geometry.featureCount = featureCount;
  }
  static updateTexelCountHintByNodeId(node, texelCountHint) {
    if (!node.mesh || !node.mesh.material) {
      return;
    }
    node.mesh.material.texelCountHint = texelCountHint;
  }
}
//# sourceMappingURL=node-pages.js.map